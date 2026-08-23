REVOKE EXECUTE ON FUNCTION public.ack_incident_for_alert(uuid, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_incident_escalation(uuid, integer) FROM anon, authenticated;