DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('channel_categories','Read categories'),
    ('channel_members','cm_select'),
    ('net_incidents','incidents read'),
    ('net_maintenance_logs','maint read'),
    ('net_response_area','area read'),
    ('message_reactions','Authenticated can read reactions'),
    ('org_roles','org_roles_read'),
    ('net_incident_reports','reports read'),
    ('org_apps','org_apps readable by signed-in users'),
    ('meeting_notes','mn_select'),
    ('announcements','announcements read'),
    ('net_suggestions','suggestions read'),
    ('net_muted_cameras','muted read'),
    ('net_settings','net_settings_read'),
    ('net_airframes','airframes read'),
    ('custom_roles','Read roles - all authenticated'),
    ('org_units','org_units_read'),
    ('user_custom_roles','Read user_custom_roles - all authenticated'),
    ('org_role_routes','org_role_routes_read'),
    ('net_drones','drones read'),
    ('net_bases','bases read'),
    ('role_route_access','role_route_access read all'),
    ('net_incident_events','incident events read')
  ) v(t,p) LOOP
    EXECUTE format('ALTER POLICY %I ON public.%I USING (private.is_employee(auth.uid()))', r.p, r.t);
  END LOOP;
END $$;

ALTER POLICY "incident events append" ON public.net_incident_events WITH CHECK (private.is_employee(auth.uid()));
ALTER POLICY "net_sweep_runs_insert" ON public.net_sweep_runs WITH CHECK (private.is_employee(auth.uid()));
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;
DROP POLICY IF EXISTS "Anyone can upload project request photos" ON storage.objects;
ALTER POLICY "avatars readable by staff" ON storage.objects USING (bucket_id = 'avatars' AND private.is_employee(auth.uid()));