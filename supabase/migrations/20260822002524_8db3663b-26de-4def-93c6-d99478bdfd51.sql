-- 1) Staff-only writes on internal business tables
DO $$
DECLARE t text; r record;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'fleet_aircraft','fleet_maintenance','ops_detections','ops_flights','ops_authorizations',
    'prod_releases','prod_features','prod_feedback','exec_objectives','exec_key_results',
    'exec_decisions','it_requests','fund_donors','fund_grants','fund_donations','team_requests',
    'net_drones','net_incidents','net_incident_reports','net_maintenance_logs','net_suggestions',
    'net_camera_prefs','net_muted_cameras','net_settings'
  ] LOOP
    FOR r IN
      SELECT policyname FROM pg_policies
      WHERE schemaname='public' AND tablename=t AND cmd IN ('INSERT','UPDATE','ALL')
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, t);
    END LOOP;
  END LOOP;
END $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'fleet_aircraft','fleet_maintenance','ops_detections','ops_flights','ops_authorizations',
    'prod_releases','prod_features','prod_feedback','exec_objectives','exec_key_results',
    'exec_decisions','it_requests','fund_donors','fund_grants','fund_donations','team_requests',
    'net_drones','net_incidents','net_incident_reports','net_maintenance_logs','net_suggestions',
    'net_camera_prefs','net_muted_cameras'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (private.is_employee(auth.uid()) OR private.is_hq_admin(auth.uid()))',
      t || '_insert_staff', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (private.is_employee(auth.uid()) OR private.is_hq_admin(auth.uid())) WITH CHECK (private.is_employee(auth.uid()) OR private.is_hq_admin(auth.uid()))',
      t || '_update_staff', t);
  END LOOP;
END $$;

-- Detection network configuration: admins only
CREATE POLICY net_settings_insert_admin ON public.net_settings
  FOR INSERT TO authenticated WITH CHECK (private.is_hq_admin(auth.uid()));
CREATE POLICY net_settings_update_admin ON public.net_settings
  FOR UPDATE TO authenticated USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));

-- 2) Shared secret for the scheduled sweep endpoint
CREATE TABLE IF NOT EXISTS private.cron_tokens (
  name text PRIMARY KEY,
  token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO private.cron_tokens (name) VALUES ('net_sweep') ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION public.net_verify_cron_token(_token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM private.cron_tokens
    WHERE name = 'net_sweep' AND _token IS NOT NULL AND token = _token
  );
$fn$;

REVOKE ALL ON FUNCTION public.net_verify_cron_token(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.net_verify_cron_token(text) TO service_role;

-- 3) Scheduled job now presents the token
SELECT cron.schedule(
  'net-camera-sweep',
  '7 * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://project--bb3b707d-fecc-4a18-be12-c9ddea559f35.lovable.app/api/public/net/sweep',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT token FROM private.cron_tokens WHERE name = 'net_sweep')
    ),
    body := '{}'::jsonb
  );
  $cron$
);