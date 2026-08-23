-- 1. Fix ack type error
CREATE OR REPLACE FUNCTION public.ack_incident_for_alert(_alert_id uuid, _user_id uuid, _channel text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE v_inc uuid;
BEGIN
  SELECT id INTO v_inc FROM public.net_incidents WHERE alert_id = _alert_id;
  IF v_inc IS NULL THEN RETURN; END IF;
  UPDATE public.net_incidents
     SET acked_by = coalesce(acked_by, _user_id),
         acked_at = coalesce(acked_at, now()),
         status = CASE WHEN status::text = 'new' THEN 'triaging'::net_incident_status ELSE status END
   WHERE id = v_inc;
  INSERT INTO public.net_incident_events (incident_id, event_type, message, actor)
  VALUES (v_inc, 'acknowledged', 'Page acknowledged via ' || _channel, _user_id);
  INSERT INTO public.net_detection_events (kind, incident_id, message, actor, detail)
  VALUES ('acked', v_inc, 'Page acknowledged via ' || _channel, _user_id, jsonb_build_object('alert_id', _alert_id));
END; $function$;

-- 2. Incident workflow columns
ALTER TABLE public.net_incidents
  ADD COLUMN IF NOT EXISTS camera_id text,
  ADD COLUMN IF NOT EXISTS camera_name text,
  ADD COLUMN IF NOT EXISTS snapshot_url text,
  ADD COLUMN IF NOT EXISTS high_risk boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolution text,
  ADD COLUMN IF NOT EXISTS resolution_notes text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_by uuid,
  ADD COLUMN IF NOT EXISTS review_cause text,
  ADD COLUMN IF NOT EXISTS review_actions text,
  ADD COLUMN IF NOT EXISTS review_lessons text,
  ADD COLUMN IF NOT EXISTS review_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_by uuid;

CREATE INDEX IF NOT EXISTS net_incidents_camera_open_idx
  ON public.net_incidents (camera_id)
  WHERE status NOT IN ('closed','false_positive');

-- 3. Incident media
CREATE TABLE IF NOT EXISTS public.net_incident_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.net_incidents(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'frame',
  url text NOT NULL,
  caption text,
  captured_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_incident_media TO authenticated;
GRANT ALL ON public.net_incident_media TO service_role;
ALTER TABLE public.net_incident_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incident media read staff" ON public.net_incident_media
  FOR SELECT TO authenticated USING (private.is_employee(auth.uid()));
CREATE POLICY "incident media add staff" ON public.net_incident_media
  FOR INSERT TO authenticated WITH CHECK (private.is_employee(auth.uid()));
CREATE POLICY "incident media delete admin" ON public.net_incident_media
  FOR DELETE TO authenticated USING (public.is_hq_admin(auth.uid()));

-- 4. High-risk cameras + minute intervals
ALTER TABLE public.net_camera_prefs ADD COLUMN IF NOT EXISTS high_risk boolean NOT NULL DEFAULT false;
ALTER TABLE public.net_settings
  ADD COLUMN IF NOT EXISTS sweep_interval_minutes integer NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS high_risk_interval_minutes integer NOT NULL DEFAULT 15;
UPDATE public.net_settings
   SET sweep_interval_minutes = GREATEST(5, coalesce(sweep_interval_hours, 1) * 60)
 WHERE id = true AND sweep_interval_minutes = 60;

-- 5. Suppress duplicate incidents per camera
CREATE OR REPLACE FUNCTION public.page_on_suggestion()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE thr numeric; v_inc uuid; v_pri text; v_open uuid; v_high boolean := false;
BEGIN
  SELECT coalesce(min_confidence, 70) INTO thr FROM public.net_settings WHERE id = true;

  INSERT INTO public.net_detection_events (kind, camera_id, camera_name, suggestion_id, label, confidence, message, detail)
  VALUES ('verdict', NEW.camera_id, NEW.camera_name, NEW.id, NEW.label::text, NEW.confidence,
          coalesce(NEW.reasoning, ''), jsonb_build_object('source', NEW.source, 'image_url', NEW.image_url));

  IF NEW.label::text IN ('smoke','fire') AND coalesce(NEW.confidence,0) >= coalesce(thr,70) AND NEW.status::text = 'pending' THEN

    IF NEW.camera_id IS NOT NULL THEN
      SELECT id INTO v_open FROM public.net_incidents
       WHERE camera_id = NEW.camera_id AND status NOT IN ('closed','false_positive')
       ORDER BY discovered_at DESC LIMIT 1;
      SELECT coalesce(high_risk,false) INTO v_high FROM public.net_camera_prefs WHERE camera_id = NEW.camera_id;
    END IF;

    IF v_open IS NOT NULL THEN
      UPDATE public.net_suggestions
         SET status = 'promoted', incident_id = v_open, resolved_at = now()
       WHERE id = NEW.id;
      IF NEW.image_url IS NOT NULL THEN
        INSERT INTO public.net_incident_media (incident_id, kind, url, caption, captured_at)
        VALUES (v_open, 'frame', NEW.image_url,
                'Re-detection · ' || NEW.label || ' ' || round(coalesce(NEW.confidence,0)) || '%', NEW.image_time);
      END IF;
      INSERT INTO public.net_incident_events (incident_id, event_type, message)
      VALUES (v_open, 'redetection', 'Camera re-detected ' || NEW.label || ' at ' || round(coalesce(NEW.confidence,0)) || '% — folded into this open incident');
      INSERT INTO public.net_detection_events (kind, camera_id, camera_name, suggestion_id, incident_id, label, confidence, message)
      VALUES ('duplicate_suppressed', NEW.camera_id, NEW.camera_name, NEW.id, v_open, NEW.label::text, NEW.confidence,
              'Duplicate suppressed — camera already has an open incident');
      RETURN NEW;
    END IF;

    v_pri := CASE WHEN NEW.label::text = 'fire' THEN (CASE WHEN NEW.confidence >= 80 THEN 'p1' ELSE 'p2' END) ELSE 'p3' END;
    IF v_high AND v_pri = 'p3' THEN v_pri := 'p2'; ELSIF v_high AND v_pri = 'p2' THEN v_pri := 'p1'; END IF;

    INSERT INTO public.net_incidents (title, source, status, priority, confidence, lat, lng, state, county, external_id, notes, suggestion_id, camera_id, camera_name, snapshot_url, high_risk)
    VALUES (initcap(NEW.label::text) || ' – ' || coalesce(NEW.camera_name, 'camera'),
            'alertwest', 'new', v_pri::net_incident_priority, NEW.confidence, NEW.lat, NEW.lng,
            NEW.state, NEW.county, NEW.id::text, NEW.reasoning, NEW.id,
            NEW.camera_id, NEW.camera_name, NEW.image_url, coalesce(v_high,false))
    RETURNING id INTO v_inc;

    UPDATE public.net_suggestions
       SET status = 'promoted', incident_id = v_inc, resolved_at = now()
     WHERE id = NEW.id;

    IF NEW.image_url IS NOT NULL THEN
      INSERT INTO public.net_incident_media (incident_id, kind, url, caption, captured_at)
      VALUES (v_inc, 'frame', NEW.image_url, 'Detection frame · ' || NEW.label || ' ' || round(coalesce(NEW.confidence,0)) || '%', NEW.image_time);
    END IF;

    INSERT INTO public.net_incident_events (incident_id, event_type, message)
    VALUES (v_inc, 'created', 'Opened automatically from AI camera detection (' || NEW.label || ', ' || round(coalesce(NEW.confidence,0)) || '%)');

    INSERT INTO public.net_detection_events (kind, camera_id, camera_name, suggestion_id, incident_id, label, confidence, message)
    VALUES ('incident_opened', NEW.camera_id, NEW.camera_name, NEW.id, v_inc, NEW.label::text, NEW.confidence,
            'Incident opened automatically from detection');
  END IF;

  RETURN NEW;
END; $function$;

-- 6. Stamp resolution / closure timestamps automatically
CREATE OR REPLACE FUNCTION public.net_incident_lifecycle()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NEW.status::text IN ('contained') AND OLD.status::text <> NEW.status::text AND NEW.resolved_at IS NULL THEN
    NEW.resolved_at := now();
    NEW.resolved_by := coalesce(NEW.resolved_by, auth.uid());
  END IF;
  IF NEW.status::text IN ('closed','false_positive') AND OLD.status::text <> NEW.status::text THEN
    NEW.closed_at := coalesce(NEW.closed_at, now());
    NEW.closed_by := coalesce(NEW.closed_by, auth.uid());
    NEW.resolved_at := coalesce(NEW.resolved_at, now());
  END IF;
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to AND NEW.assigned_to IS NOT NULL THEN
    NEW.assigned_at := now();
  END IF;
  RETURN NEW;
END; $function$;

DROP TRIGGER IF EXISTS net_incident_lifecycle_trg ON public.net_incidents;
CREATE TRIGGER net_incident_lifecycle_trg BEFORE UPDATE ON public.net_incidents
FOR EACH ROW EXECUTE FUNCTION public.net_incident_lifecycle();