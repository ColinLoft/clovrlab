update public.org_apps set nav_groups = case slug
  when 'hq' then array['Core']
  when 'exec' then array['Core','Operations','Funding']
  when 'product' then array['Core','Engineering']
  when 'eng' then array['Core','Engineering','Fleet & Supply']
  when 'mfg' then array['Core','Fleet & Supply']
  when 'ops' then array['Core','Mission Operations','Fleet & Supply']
  when 'systems' then array['Core','Operations']
  when 'commercial' then array['Core','Funding','Research & Partners']
  when 'admin' then array['Core','People','Operations']
  else nav_groups end
where slug in ('hq','exec','product','eng','mfg','ops','systems','commercial','admin');