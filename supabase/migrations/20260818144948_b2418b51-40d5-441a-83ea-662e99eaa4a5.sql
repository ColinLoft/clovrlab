DROP TABLE IF EXISTS public.channel_role_access;

DROP POLICY IF EXISTS "Read route access" ON public.role_route_access;
DROP POLICY IF EXISTS "Anyone can read role routes" ON public.role_route_access;
CREATE POLICY "Admins read route access" ON public.role_route_access
  FOR SELECT TO authenticated USING (public.is_hq_admin(auth.uid()));

DROP POLICY IF EXISTS "Read org role routes" ON public.org_role_routes;
DROP POLICY IF EXISTS "Anyone can read org role routes" ON public.org_role_routes;
CREATE POLICY "Admins read org role routes" ON public.org_role_routes
  FOR SELECT TO authenticated USING (public.is_hq_admin(auth.uid()));

DROP POLICY IF EXISTS "Read custom roles" ON public.custom_roles;
DROP POLICY IF EXISTS "Anyone can read custom roles" ON public.custom_roles;
CREATE POLICY "Admins read custom roles" ON public.custom_roles
  FOR SELECT TO authenticated USING (public.is_hq_admin(auth.uid()));