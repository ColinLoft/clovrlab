REVOKE EXECUTE ON FUNCTION public.is_hq_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.my_access() FROM anon;
REVOKE EXECUTE ON FUNCTION public.onboarding_invite_check(text) FROM anon, authenticated;