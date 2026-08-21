
ALTER POLICY "company_email read all authed" ON public.company_email_settings USING (private.is_employee(auth.uid()));
ALTER POLICY "fund_donors_read" ON public.fund_donors USING (private.is_employee(auth.uid()));
ALTER POLICY "fund_donations_read" ON public.fund_donations USING (private.is_employee(auth.uid()));
ALTER POLICY "fund_grants_read" ON public.fund_grants USING (private.is_employee(auth.uid()));
ALTER POLICY "Authenticated can view email events" ON public.hq_email_events USING (private.is_employee(auth.uid()));
ALTER POLICY "it_requests_read" ON public.it_requests USING (private.is_employee(auth.uid()));
ALTER POLICY "team_requests_read" ON public.team_requests USING (private.is_employee(auth.uid()));
ALTER POLICY "fleet_aircraft_read" ON public.fleet_aircraft USING (private.is_employee(auth.uid()));
ALTER POLICY "fleet_maintenance_read" ON public.fleet_maintenance USING (private.is_employee(auth.uid()));
ALTER POLICY "exec_objectives_read" ON public.exec_objectives USING (private.is_employee(auth.uid()));
ALTER POLICY "exec_key_results_read" ON public.exec_key_results USING (private.is_employee(auth.uid()));
ALTER POLICY "exec_decisions_read" ON public.exec_decisions USING (private.is_employee(auth.uid()));
ALTER POLICY "prod_features_read" ON public.prod_features USING (private.is_employee(auth.uid()));
ALTER POLICY "prod_feedback_read" ON public.prod_feedback USING (private.is_employee(auth.uid()));
ALTER POLICY "prod_releases_read" ON public.prod_releases USING (private.is_employee(auth.uid()));
ALTER POLICY "ops_detections_read" ON public.ops_detections USING (private.is_employee(auth.uid()));
ALTER POLICY "ops_flights_read" ON public.ops_flights USING (private.is_employee(auth.uid()));
ALTER POLICY "ops_authorizations_read" ON public.ops_authorizations USING (private.is_employee(auth.uid()));
ALTER POLICY "m_select" ON public.meetings USING (
  private.is_employee(auth.uid())
  OR host_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.meeting_participants mp WHERE mp.meeting_id = meetings.id AND mp.user_id = auth.uid())
);
ALTER POLICY "mp_select" ON public.meeting_participants USING (
  private.is_employee(auth.uid())
  OR user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.meetings m WHERE m.id = meeting_participants.meeting_id AND m.host_id = auth.uid())
);
