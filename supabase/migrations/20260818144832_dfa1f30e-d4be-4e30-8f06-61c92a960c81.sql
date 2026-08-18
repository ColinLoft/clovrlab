REVOKE EXECUTE ON FUNCTION public.is_hq_admin(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.my_access() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.onboarding_invite_check(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.hr_employee_auto_invite() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_hq_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_access() TO authenticated;