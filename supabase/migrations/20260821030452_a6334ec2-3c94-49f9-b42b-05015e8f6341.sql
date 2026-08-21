insert into public.org_role_routes (role_id, route)
select distinct r.role_id, m.new_route
from (values
  ('/ops/coverage','/ops/maintenance'),
  ('/eng/programs','/eng/board'),
  ('/product/roadmap','/product/support'),
  ('/mfg/line','/mfg/returns'),
  ('/systems/services','/systems/assets'),
  ('/fund/donors','/fund/pipeline'),
  ('/exec/decisions','/exec/announcements'),
  ('/employees','/admin/policies')
) as m(src_route, new_route)
join public.org_role_routes r on r.route = m.src_route
where not exists (
  select 1 from public.org_role_routes x where x.role_id = r.role_id and x.route = m.new_route
);