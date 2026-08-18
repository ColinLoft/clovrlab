
-- 1. Admin-only configuration tables
DROP POLICY IF EXISTS "Employees manage admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Employees manage domains" ON public.admin_domains;
DROP POLICY IF EXISTS "Employees manage permission overrides" ON public.admin_permission_overrides;

CREATE POLICY "Admins manage admin settings" ON public.admin_settings
  FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
CREATE POLICY "Admins manage domains" ON public.admin_domains
  FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
CREATE POLICY "Admins manage permission overrides" ON public.admin_permission_overrides
  FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));

-- 2. Suspensions: admins write, staff read their own
DROP POLICY IF EXISTS "suspensions all authed" ON public.hr_suspensions;
CREATE POLICY "Admins manage suspensions" ON public.hr_suspensions
  FOR ALL TO authenticated
  USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
CREATE POLICY "Staff read own suspension" ON public.hr_suspensions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 3. Enforce suspension at the database level
CREATE OR REPLACE FUNCTION private.is_employee(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $fn$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
     AND NOT private.is_suspended(_user_id);
$fn$;

CREATE OR REPLACE FUNCTION private.is_hq_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin')
  ) AND NOT private.is_suspended(_user_id);
$fn$;

CREATE OR REPLACE FUNCTION private.has_role_permission(_user_id uuid, _permission text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $fn$
  SELECT (EXISTS(
    SELECT 1 FROM public.user_custom_roles ucr
    JOIN public.custom_roles cr ON cr.id = ucr.role_id
    WHERE ucr.user_id = _user_id
      AND (COALESCE((cr.permissions->>_permission)::boolean, false) = true
           OR COALESCE((cr.permissions->>'admin')::boolean, false) = true)
  ) OR EXISTS(
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin')
  )) AND NOT private.is_suspended(_user_id);
$fn$;

-- 4. Portal messages must reference a job belonging to the same client
DROP POLICY IF EXISTS "Portal writes own messages" ON public.con_client_messages;
CREATE POLICY "Portal writes own messages" ON public.con_client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id IN (SELECT private.portal_client_ids(auth.uid()))
    AND author_id = auth.uid()
    AND from_client = true
    AND (
      job_id IS NULL
      OR EXISTS (SELECT 1 FROM public.con_jobs j WHERE j.id = job_id AND j.client_id = con_client_messages.client_id)
    )
  );

-- 5. Recipients may only mark direct messages as read
CREATE OR REPLACE FUNCTION public.dm_recipient_read_only()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
BEGIN
  IF auth.uid() IS DISTINCT FROM OLD.sender_id THEN
    NEW.id := OLD.id;
    NEW.sender_id := OLD.sender_id;
    NEW.recipient_id := OLD.recipient_id;
    NEW.body := OLD.body;
    NEW.attachments := OLD.attachments;
    NEW.mentions := OLD.mentions;
    NEW.reply_to_id := OLD.reply_to_id;
    NEW.created_at := OLD.created_at;
    NEW.edited_at := OLD.edited_at;
    NEW.deleted_at := OLD.deleted_at;
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_dm_recipient_read_only ON public.direct_messages;
CREATE TRIGGER trg_dm_recipient_read_only
  BEFORE UPDATE ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION public.dm_recipient_read_only();

-- 6. Stop exposing SECURITY DEFINER helpers to signed-in users
ALTER POLICY "Admins read route access" ON public.role_route_access USING (private.is_hq_admin(auth.uid()));
ALTER POLICY "Admins read org role routes" ON public.org_role_routes USING (private.is_hq_admin(auth.uid()));
ALTER POLICY "Admins read custom roles" ON public.custom_roles USING (private.is_hq_admin(auth.uid()));
ALTER POLICY "org_units_admin" ON public.org_units USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
ALTER POLICY "org_roles_admin" ON public.org_roles USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
ALTER POLICY "org_role_routes_admin" ON public.org_role_routes USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
ALTER POLICY "org_apps managed by admins" ON public.org_apps USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
ALTER POLICY "user_org_roles_self_read" ON public.user_org_roles USING ((user_id = auth.uid()) OR private.is_hq_admin(auth.uid()));
ALTER POLICY "user_org_roles_admin" ON public.user_org_roles USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));
ALTER POLICY "user_route_overrides_self_read" ON public.user_route_overrides USING ((user_id = auth.uid()) OR private.is_hq_admin(auth.uid()));
ALTER POLICY "user_route_overrides_admin" ON public.user_route_overrides USING (private.is_hq_admin(auth.uid())) WITH CHECK (private.is_hq_admin(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.is_hq_admin(uuid) FROM authenticated, anon, PUBLIC;

-- my_access is self-scoped; run it as the caller so RLS applies
CREATE OR REPLACE FUNCTION public.my_access()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY INVOKER
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
  admin := private.is_hq_admin(uid);

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
