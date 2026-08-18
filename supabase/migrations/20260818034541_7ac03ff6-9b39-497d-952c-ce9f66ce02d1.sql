insert into public.user_org_roles (user_id, role_id)
select '20293dd9-9b87-49e2-98f2-61fdd193398a', r.id from public.org_roles r
where r.slug like '%-lead'
on conflict do nothing;
insert into public.user_roles (user_id, role) values ('20293dd9-9b87-49e2-98f2-61fdd193398a','super_admin') on conflict do nothing;