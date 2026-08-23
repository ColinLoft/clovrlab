-- 1. Detection timeline -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.net_detection_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  trigger text,
  sweep_run_id uuid,
  camera_id text,
  camera_name text,
  suggestion_id uuid,
  incident_id uuid,
  label text,
  confidence numeric,
  message text,
  actor uuid,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS net_detection_events_created_idx ON public.net_detection_events (created_at DESC);
CREATE INDEX IF NOT EXISTS net_detection_events_sweep_idx ON public.net_detection_events (sweep_run_id);

GRANT SELECT, INSERT ON public.net_detection_events TO authenticated;
GRANT ALL ON public.net_detection_events TO service_role;
ALTER TABLE public.net_detection_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff read detection events" ON public.net_detection_events;
CREATE POLICY "staff read detection events" ON public.net_detection_events
  FOR SELECT TO authenticated USING (private.is_employee(auth.uid()));
DROP POLICY IF EXISTS "staff write detection events" ON public.net_detection_events;
CREATE POLICY "staff write detection events" ON public.net_detection_events
  FOR INSERT TO authenticated WITH CHECK (private.is_employee(auth.uid()));

-- 2. Incident <-> page linkage ------------------------------------------
ALTER TABLE public.net_incidents
  ADD COLUMN IF NOT EXISTS alert_id uuid,
  ADD COLUMN IF NOT EXISTS acked_by uuid,
  ADD COLUMN IF NOT EXISTS acked_at timestamptz,
  ADD COLUMN IF NOT EXISTS suggestion_id uuid;

ALTER TABLE public.oncall_rotations
  ADD COLUMN IF NOT EXISTS repeat_minutes integer NOT NULL DEFAULT 15;

-- 3. raise_page: detections/incidents live in the incident system, not tickets
CREATE OR REPLACE FUNCTION public.raise_page(_kind text, _title text, _body text DEFAULT NULL::text, _link text DEFAULT NULL::text, _severity text DEFAULT 'critical'::text, _source_table text DEFAULT NULL::text, _source_id uuid DEFAULT NULL::uuid, _queue text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_rot public.oncall_rotations%ROWTYPE;
  v_alert uuid;
  v_count int := 0;
  v_queue text;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT private.is_employee(auth.uid()) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  v_queue := coalesce(_queue, CASE WHEN _kind IN ('system','service','infrastructure','security') THEN 'systems' ELSE 'ops' END);

  SELECT * INTO v_rot FROM public.oncall_rotations
   WHERE active AND queue = v_queue AND (_kind = ANY(kinds) OR cardinality(kinds) = 0)
   ORDER BY (CASE WHEN _kind = ANY(kinds) THEN 0 ELSE 1 END), created_at
   LIMIT 1;

  INSERT INTO public.page_alerts (kind, severity, title, body, link, source_table, source_id, rotation_id, created_by, next_escalation_at, queue)
  VALUES (_kind, coalesce(_severity,'critical'), _title, _body,
          coalesce(_link, CASE WHEN v_queue = 'systems' THEN '/systems/paging' ELSE '/ops/paging' END),
          _source_table, _source_id, v_rot.id, auth.uid(),
          now() + (coalesce(v_rot.escalation_minutes, 5) || ' minutes')::interval, v_queue)
  RETURNING id INTO v_alert;

  IF v_rot.id IS NOT NULL THEN
    INSERT INTO public.page_targets (alert_id, user_id, level)
    SELECT v_alert, m.user_id, 1 FROM public.oncall_members m
     WHERE m.rotation_id = v_rot.id AND m.tier = 1
    ON CONFLICT DO NOTHING;
    GET DIAGNOSTICS v_count = ROW_COUNT;
  END IF;

  IF v_count = 0 THEN
    INSERT INTO public.page_targets (alert_id, user_id, level)
    SELECT DISTINCT v_alert, ur.user_id, 1 FROM public.user_roles ur
    ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.notifications (user_id, title, body, link)
  SELECT t.user_id, '🚨 ' || _title, coalesce(_body,''),
         coalesce(_link, CASE WHEN v_queue = 'systems' THEN '/systems/paging' ELSE '/ops/paging' END)
    FROM public.page_targets t WHERE t.alert_id = v_alert;

  IF _source_table = 'net_incidents' THEN
    UPDATE public.net_incidents SET alert_id = v_alert WHERE id = _source_id;
    INSERT INTO public.net_incident_events (incident_id, event_type, message)
    VALUES (_source_id, 'paged', 'On-call paged: ' || _title);
    INSERT INTO public.net_detection_events (kind, incident_id, message, detail)
    VALUES ('paged', _source_id, 'On-call paged', jsonb_build_object('alert_id', v_alert));
  ELSE
    INSERT INTO public.page_tickets (alert_id, queue, title, summary, kind, severity, created_by)
    VALUES (v_alert, v_queue, _title, _body, _kind, coalesce(_severity,'critical'), auth.uid())
    ON CONFLICT (alert_id) DO NOTHING;
  END IF;

  RETURN v_alert;
END; $function$;

-- 4. Detection -> incident
CREATE OR REPLACE FUNCTION public.page_on_suggestion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE thr numeric; v_inc uuid; v_pri text;
BEGIN
  SELECT coalesce(min_confidence, 70) INTO thr FROM public.net_settings WHERE id = true;

  INSERT INTO public.net_detection_events (kind, camera_id, camera_name, suggestion_id, label, confidence, message, detail)
  VALUES ('verdict', NEW.camera_id, NEW.camera_name, NEW.id, NEW.label::text, NEW.confidence,
          coalesce(NEW.reasoning, ''), jsonb_build_object('source', NEW.source, 'image_url', NEW.image_url));

  IF NEW.label::text IN ('smoke','fire') AND coalesce(NEW.confidence,0) >= coalesce(thr,70) AND NEW.status::text = 'pending' THEN
    v_pri := CASE WHEN NEW.label::text = 'fire' THEN (CASE WHEN NEW.confidence >= 80 THEN 'p1' ELSE 'p2' END) ELSE 'p3' END;

    INSERT INTO public.net_incidents (title, source, status, priority, confidence, lat, lng, state, county, external_id, notes, suggestion_id)
    VALUES (initcap(NEW.label::text) || ' – ' || coalesce(NEW.camera_name, 'camera'),
            'alertwest', 'new', v_pri::net_incident_priority, NEW.confidence, NEW.lat, NEW.lng,
            NEW.state, NEW.county, NEW.id::text, NEW.reasoning, NEW.id)
    RETURNING id INTO v_inc;

    UPDATE public.net_suggestions
       SET status = 'promoted', incident_id = v_inc, resolved_at = now()
     WHERE id = NEW.id;

    INSERT INTO public.net_incident_events (incident_id, event_type, message)
    VALUES (v_inc, 'created', 'Opened automatically from AI camera detection (' || NEW.label || ', ' || round(coalesce(NEW.confidence,0)) || '%)');

    INSERT INTO public.net_detection_events (kind, camera_id, camera_name, suggestion_id, incident_id, label, confidence, message)
    VALUES ('incident_opened', NEW.camera_id, NEW.camera_name, NEW.id, v_inc, NEW.label::text, NEW.confidence,
            'Incident opened automatically from detection');
  END IF;

  RETURN NEW;
END; $function$;

-- 5. Incident paging links straight to the incident record
CREATE OR REPLACE FUNCTION public.page_on_incident()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM public.raise_page('incident',
    'New incident: ' || coalesce(NEW.title,'untitled'),
    'Priority ' || upper(coalesce(NEW.priority::text,'p3')) || ' · source ' || coalesce(NEW.source::text,'manual'),
    '/ops/incidents?id=' || NEW.id, CASE WHEN NEW.priority::text IN ('p1','p2') THEN 'critical' ELSE 'high' END,
    'net_incidents', NEW.id);
  RETURN NEW;
END; $function$;

-- 6. Ack helpers
CREATE OR REPLACE FUNCTION public.ack_incident_for_alert(_alert_id uuid, _user_id uuid, _channel text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  VALUES (v_inc, 'acknowledged', 'Page acknowledged via ' || _channel, _user_id::text);
  INSERT INTO public.net_detection_events (kind, incident_id, message, actor, detail)
  VALUES ('acked', v_inc, 'Page acknowledged via ' || _channel, _user_id, jsonb_build_object('alert_id', _alert_id));
END; $function$;

REVOKE ALL ON FUNCTION public.ack_incident_for_alert(uuid, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.ack_incident_for_alert(uuid, uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.ack_page(_alert_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT private.is_employee(auth.uid()) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.page_alerts
     SET status = CASE WHEN status = 'open' THEN 'acked' ELSE status END,
         acked_by = coalesce(acked_by, auth.uid()),
         acked_at = coalesce(acked_at, now()),
         next_escalation_at = NULL
   WHERE id = _alert_id;
  UPDATE public.page_targets
     SET seen_at = coalesce(seen_at, now()), acked_at = coalesce(acked_at, now())
   WHERE alert_id = _alert_id AND user_id = auth.uid();
  UPDATE public.page_tickets
     SET acked_at = coalesce(acked_at, now()), acked_by = coalesce(acked_by, auth.uid()),
         status = CASE WHEN status = 'open' THEN 'investigating' ELSE status END
   WHERE alert_id = _alert_id;
  UPDATE public.push_topics SET last_ack_at = now() WHERE user_id = auth.uid();
  INSERT INTO public.page_deliveries (alert_id, user_id, channel, status, detail)
  VALUES (_alert_id, auth.uid(), 'app', 'acknowledged', 'Acknowledged in console');
  PERFORM public.ack_incident_for_alert(_alert_id, auth.uid(), 'console');
END; $function$;

CREATE OR REPLACE FUNCTION public.ack_page_by_token(_token uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE t public.page_targets%ROWTYPE;
BEGIN
  SELECT * INTO t FROM public.page_targets WHERE ack_token = _token;
  IF t.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'unknown token'); END IF;

  UPDATE public.page_targets
     SET acked_at = coalesce(acked_at, now()), seen_at = coalesce(seen_at, now())
   WHERE id = t.id;
  UPDATE public.page_alerts
     SET status = CASE WHEN status = 'open' THEN 'acked' ELSE status END,
         acked_by = coalesce(acked_by, t.user_id),
         acked_at = coalesce(acked_at, now()),
         next_escalation_at = NULL
   WHERE id = t.alert_id;
  UPDATE public.page_tickets
     SET acked_at = coalesce(acked_at, now()), acked_by = coalesce(acked_by, t.user_id),
         status = CASE WHEN status = 'open' THEN 'investigating' ELSE status END
   WHERE alert_id = t.alert_id;
  UPDATE public.push_topics SET last_ack_at = now() WHERE user_id = t.user_id;
  INSERT INTO public.page_deliveries (alert_id, target_id, user_id, channel, status, detail)
  VALUES (t.alert_id, t.id, t.user_id, 'ntfy', 'acknowledged', 'Acknowledged from push notification');
  PERFORM public.ack_incident_for_alert(t.alert_id, t.user_id, 'push notification');
  RETURN jsonb_build_object('ok', true, 'alert_id', t.alert_id);
END; $function$;

-- 7. Escalation ladder
CREATE OR REPLACE FUNCTION public.log_incident_escalation(_alert_id uuid, _level integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_inc uuid;
BEGIN
  SELECT id INTO v_inc FROM public.net_incidents WHERE alert_id = _alert_id;
  IF v_inc IS NULL THEN RETURN; END IF;
  INSERT INTO public.net_incident_events (incident_id, event_type, message)
  VALUES (v_inc, 'escalated', 'Page unacknowledged — escalated to on-call tier ' || _level);
  INSERT INTO public.net_detection_events (kind, incident_id, message, detail)
  VALUES ('escalated', v_inc, 'Page escalated to tier ' || _level, jsonb_build_object('alert_id', _alert_id));
END; $function$;

REVOKE ALL ON FUNCTION public.log_incident_escalation(uuid, integer) FROM public;
GRANT EXECUTE ON FUNCTION public.log_incident_escalation(uuid, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.escalate_pages()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE a RECORD; v_rot public.oncall_rotations%ROWTYPE; n int := 0;
BEGIN
  FOR a IN SELECT * FROM public.page_alerts
            WHERE status = 'open' AND next_escalation_at IS NOT NULL AND next_escalation_at <= now()
  LOOP
    SELECT * INTO v_rot FROM public.oncall_rotations WHERE id = a.rotation_id;
    IF v_rot.id IS NULL OR a.level >= coalesce(v_rot.max_level, 3) THEN
      UPDATE public.page_alerts
         SET next_escalation_at = now() + (coalesce(v_rot.repeat_minutes, 15) || ' minutes')::interval
       WHERE id = a.id;
      INSERT INTO public.page_deliveries (alert_id, channel, status, detail)
      VALUES (a.id, 'app', 'escalated', 'Top of ladder reached — re-paging tier ' || a.level);
      CONTINUE;
    END IF;
    UPDATE public.page_alerts
       SET level = a.level + 1,
           next_escalation_at = now() + (coalesce(v_rot.escalation_minutes,5) || ' minutes')::interval
     WHERE id = a.id;
    INSERT INTO public.page_targets (alert_id, user_id, level)
    SELECT a.id, m.user_id, a.level + 1 FROM public.oncall_members m
     WHERE m.rotation_id = v_rot.id AND m.tier = a.level + 1
    ON CONFLICT DO NOTHING;
    INSERT INTO public.notifications (user_id, title, body, link)
    SELECT m.user_id, '🚨 ESCALATED: ' || a.title, coalesce(a.body,''), coalesce(a.link, '/ops/paging')
      FROM public.oncall_members m WHERE m.rotation_id = v_rot.id AND m.tier = a.level + 1;
    INSERT INTO public.page_deliveries (alert_id, channel, status, detail)
    VALUES (a.id, 'app', 'escalated', 'Unacknowledged after ' || coalesce(v_rot.escalation_minutes,5) || ' min — escalated to tier ' || (a.level + 1));
    PERFORM public.log_incident_escalation(a.id, a.level + 1);
    n := n + 1;
  END LOOP;
  RETURN n;
END; $function$;