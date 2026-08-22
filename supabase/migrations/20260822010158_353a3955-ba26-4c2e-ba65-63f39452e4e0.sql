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
  IF auth.uid() IS NOT NULL AND NOT private.is_employee(auth.uid()) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

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

REVOKE EXECUTE ON FUNCTION public.raise_page(text,text,text,text,text,text,uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.page_on_suggestion() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.page_on_incident() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.page_on_drone_down() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.page_on_sweep_failure() FROM anon, authenticated;
