CREATE OR REPLACE FUNCTION public.my_access()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  admin boolean;
  routes text[];
  units text[];
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('is_admin', false, 'routes', '[]'::jsonb, 'units', '[]'::jsonb);
  END IF;
  admin := public.is_hq_admin(uid);

  SELECT coalesce(array_agg(DISTINCT r.route), '{}') INTO routes
  FROM (
    SELECT rr.route
      FROM public.user_org_roles uor
      JOIN public.org_role_routes rr ON rr.role_id = uor.role_id
     WHERE uor.user_id = uid
    UNION
    SELECT rr.route
      FROM public.profiles p
      JOIN public.org_roles orl ON orl.org_unit_id = p.org_unit_id AND orl.is_default
      JOIN public.org_role_routes rr ON rr.role_id = orl.id
     WHERE p.id = uid
    UNION
    SELECT o.route FROM public.user_route_overrides o WHERE o.user_id = uid AND o.granted
  ) r
  WHERE r.route NOT IN (
    SELECT route FROM public.user_route_overrides WHERE user_id = uid AND NOT granted
  );

  WITH RECURSIVE direct AS (
    SELECT p.org_unit_id AS unit_id FROM public.profiles p WHERE p.id = uid AND p.org_unit_id IS NOT NULL
    UNION
    SELECT orl.org_unit_id
      FROM public.user_org_roles uor
      JOIN public.org_roles orl ON orl.id = uor.role_id
     WHERE uor.user_id = uid AND orl.org_unit_id IS NOT NULL
  ),
  tree AS (
    SELECT u.id, u.parent_id, u.slug FROM public.org_units u JOIN direct d ON d.unit_id = u.id
    UNION
    SELECT parent.id, parent.parent_id, parent.slug
      FROM public.org_units parent
      JOIN tree t ON t.parent_id = parent.id
  )
  SELECT coalesce(array_agg(DISTINCT tree.slug), '{}') INTO units FROM tree;

  RETURN jsonb_build_object('is_admin', admin, 'routes', to_jsonb(routes), 'units', to_jsonb(units));
END; $function$;