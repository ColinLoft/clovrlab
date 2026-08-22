-- ============ user prefs ============
CREATE TABLE public.user_prefs (
  user_id uuid PRIMARY KEY,
  prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_prefs TO authenticated;
GRANT ALL ON public.user_prefs TO service_role;
ALTER TABLE public.user_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prefs" ON public.user_prefs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_prefs_updated BEFORE UPDATE ON public.user_prefs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ on-call rotations ============
CREATE TABLE public.oncall_rotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  workspace text,
  kinds text[] NOT NULL DEFAULT '{}',
  escalation_minutes int NOT NULL DEFAULT 5,
  max_level int NOT NULL DEFAULT 3,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oncall_rotations TO authenticated;
GRANT ALL ON public.oncall_rotations TO service_role;
ALTER TABLE public.oncall_rotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rotations read" ON public.oncall_rotations FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
CREATE POLICY "rotations manage" ON public.oncall_rotations FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
CREATE TRIGGER oncall_rotations_updated BEFORE UPDATE ON public.oncall_rotations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.oncall_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rotation_id uuid NOT NULL REFERENCES public.oncall_rotations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tier int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rotation_id, user_id, tier)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oncall_members TO authenticated;
GRANT ALL ON public.oncall_members TO service_role;
ALTER TABLE public.oncall_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oncall read" ON public.oncall_members FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
CREATE POLICY "oncall manage" ON public.oncall_members FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));

-- ============ pages ============
CREATE TABLE public.page_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'manual',
  severity text NOT NULL DEFAULT 'critical',
  title text NOT NULL,
  body text,
  link text,
  source_table text,
  source_id uuid,
  rotation_id uuid REFERENCES public.oncall_rotations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open',
  level int NOT NULL DEFAULT 1,
  next_escalation_at timestamptz,
  acked_by uuid,
  acked_at timestamptz,
  resolved_by uuid,
  resolved_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_alerts_open_idx ON public.page_alerts (status, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_alerts TO authenticated;
GRANT ALL ON public.page_alerts TO service_role;
ALTER TABLE public.page_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages read" ON public.page_alerts FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
CREATE POLICY "pages insert" ON public.page_alerts FOR INSERT TO authenticated
  WITH CHECK (private.is_employee(auth.uid()));
CREATE POLICY "pages update" ON public.page_alerts FOR UPDATE TO authenticated
  USING (private.is_employee(auth.uid())) WITH CHECK (private.is_employee(auth.uid()));
CREATE POLICY "pages delete admin" ON public.page_alerts FOR DELETE TO authenticated
  USING (private.is_hq_admin(auth.uid()));

CREATE TABLE public.page_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.page_alerts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  level int NOT NULL DEFAULT 1,
  email_sent_at timestamptz,
  seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (alert_id, user_id)
);
CREATE INDEX page_targets_user_idx ON public.page_targets (user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_targets TO authenticated;
GRANT ALL ON public.page_targets TO service_role;
ALTER TABLE public.page_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "targets read" ON public.page_targets FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
CREATE POLICY "targets update own" ON public.page_targets FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "targets manage admin" ON public.page_targets FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.page_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_targets;
ALTER TABLE public.page_alerts REPLICA IDENTITY FULL;
ALTER TABLE public.page_targets REPLICA IDENTITY FULL;

-- ============ paging engine ============
CREATE OR REPLACE FUNCTION public.raise_page(
  _kind text, _title text, _body text DEFAULT NULL, _link text DEFAULT NULL,
  _severity text DEFAULT 'critical', _source_table text DEFAULT NULL, _source_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_rot public.oncall_rotations%ROWTYPE;
  v_alert uuid;
  v_count int := 0;
BEGIN
  SELECT * INTO v_rot FROM public.oncall_rotations
   WHERE active AND (_kind = ANY(kinds) OR cardinality(kinds) = 0)
   ORDER BY (CASE WHEN _kind = ANY(kinds) THEN 0 ELSE 1 END), created_at
   LIMIT 1;

  INSERT INTO public.page_alerts (kind, severity, title, body, link, source_table, source_id, rotation_id, created_by, next_escalation_at)
  VALUES (_kind, coalesce(_severity,'critical'), _title, _body, _link, _source_table, _source_id, v_rot.id, auth.uid(),
          now() + (coalesce(v_rot.escalation_minutes, 5) || ' minutes')::interval)
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
  SELECT t.user_id, '🚨 ' || _title, coalesce(_body,''), coalesce(_link, '/ops/paging')
    FROM public.page_targets t WHERE t.alert_id = v_alert;

  RETURN v_alert;
END; $$;

CREATE OR REPLACE FUNCTION public.ack_page(_alert_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT private.is_employee(auth.uid()) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.page_alerts
     SET status = CASE WHEN status = 'open' THEN 'acked' ELSE status END,
         acked_by = coalesce(acked_by, auth.uid()),
         acked_at = coalesce(acked_at, now()),
         next_escalation_at = NULL
   WHERE id = _alert_id;
  UPDATE public.page_targets SET seen_at = coalesce(seen_at, now())
   WHERE alert_id = _alert_id AND user_id = auth.uid();
END; $$;

CREATE OR REPLACE FUNCTION public.resolve_page(_alert_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT private.is_employee(auth.uid()) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.page_alerts
     SET status = 'resolved', resolved_by = auth.uid(), resolved_at = now(), next_escalation_at = NULL,
         acked_by = coalesce(acked_by, auth.uid()), acked_at = coalesce(acked_at, now())
   WHERE id = _alert_id;
END; $$;

CREATE OR REPLACE FUNCTION public.escalate_pages() RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a RECORD; v_rot public.oncall_rotations%ROWTYPE; n int := 0;
BEGIN
  FOR a IN SELECT * FROM public.page_alerts
            WHERE status = 'open' AND next_escalation_at IS NOT NULL AND next_escalation_at <= now()
  LOOP
    SELECT * INTO v_rot FROM public.oncall_rotations WHERE id = a.rotation_id;
    IF v_rot.id IS NULL OR a.level >= coalesce(v_rot.max_level, 3) THEN
      UPDATE public.page_alerts SET next_escalation_at = now() + interval '15 minutes' WHERE id = a.id;
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
    n := n + 1;
  END LOOP;
  RETURN n;
END; $$;

REVOKE EXECUTE ON FUNCTION public.raise_page(text,text,text,text,text,text,uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.escalate_pages() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ack_page(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.resolve_page(uuid) FROM anon;

-- ============ automatic triggers ============
CREATE OR REPLACE FUNCTION public.page_on_suggestion() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE thr numeric;
BEGIN
  SELECT coalesce(min_confidence, 70) INTO thr FROM public.net_settings WHERE id = true;
  IF NEW.label IN ('smoke','fire') AND coalesce(NEW.confidence,0) >= coalesce(thr,70) THEN
    PERFORM public.raise_page('detection',
      upper(NEW.label::text) || ' detected — ' || coalesce(NEW.camera_name,'camera'),
      round(coalesce(NEW.confidence,0)) || '% confidence. ' || coalesce(NEW.reasoning,''),
      '/ops/cameras', 'critical', 'net_suggestions', NEW.id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_page_on_suggestion AFTER INSERT ON public.net_suggestions
FOR EACH ROW EXECUTE FUNCTION public.page_on_suggestion();

CREATE OR REPLACE FUNCTION public.page_on_incident() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.raise_page('incident',
    'New incident: ' || coalesce(NEW.title,'untitled'),
    'Priority ' || upper(coalesce(NEW.priority::text,'p3')) || ' · source ' || coalesce(NEW.source::text,'manual'),
    '/ops/incidents', CASE WHEN NEW.priority::text IN ('p1','p2') THEN 'critical' ELSE 'high' END,
    'net_incidents', NEW.id);
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_page_on_incident AFTER INSERT ON public.net_incidents
FOR EACH ROW EXECUTE FUNCTION public.page_on_incident();

CREATE OR REPLACE FUNCTION public.page_on_drone_down() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status::text = 'offline' AND coalesce(OLD.status::text,'') <> 'offline' THEN
    PERFORM public.raise_page('fleet', 'Aircraft offline: ' || coalesce(NEW.name,'unknown'),
      'The aircraft stopped reporting and is out of the ready pool.', '/ops/network-fleet',
      'critical', 'net_drones', NEW.id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_page_on_drone_down AFTER UPDATE ON public.net_drones
FOR EACH ROW EXECUTE FUNCTION public.page_on_drone_down();

CREATE OR REPLACE FUNCTION public.page_on_sweep_failure() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(NEW.error_count,0) > 0 AND coalesce(NEW.analyzed,0) = 0 THEN
    PERFORM public.raise_page('system', 'Detection sweep failed',
      coalesce(NEW.first_error,'The scheduled AI sweep returned no analysed frames.'),
      '/systems/detection', 'high', 'net_sweep_runs', NEW.id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_page_on_sweep_failure AFTER INSERT ON public.net_sweep_runs
FOR EACH ROW EXECUTE FUNCTION public.page_on_sweep_failure();

-- default rotation
INSERT INTO public.oncall_rotations (name, workspace, kinds, escalation_minutes, max_level)
VALUES ('Primary on-call', 'ops', '{}', 5, 3);

-- escalation schedule
SELECT cron.schedule('page-escalation', '* * * * *', $$SELECT public.escalate_pages();$$);
