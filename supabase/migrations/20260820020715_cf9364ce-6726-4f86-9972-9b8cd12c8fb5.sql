
CREATE TABLE public.team_requests (
  id uuid primary key default gen_random_uuid(),
  from_team text not null,
  to_team text not null,
  subject text not null,
  details text,
  entity_type text,
  entity_id uuid,
  priority text not null default 'normal',
  status text not null default 'open',
  due_date date,
  requested_by uuid references auth.users(id) on delete set null,
  assignee_id uuid references auth.users(id) on delete set null,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.fleet_aircraft (
  id uuid primary key default gen_random_uuid(),
  tail_number text not null,
  model text,
  status text not null default 'available',
  base text,
  flight_hours numeric not null default 0,
  cycles integer not null default 0,
  next_service_hours numeric,
  next_service_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.fleet_maintenance (
  id uuid primary key default gen_random_uuid(),
  aircraft_id uuid references public.fleet_aircraft(id) on delete cascade,
  title text not null,
  kind text not null default 'scheduled',
  severity text not null default 'normal',
  grounding boolean not null default false,
  status text not null default 'open',
  assignee_id uuid references auth.users(id) on delete set null,
  opened_on date not null default current_date,
  closed_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.ops_detections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source text not null default 'sensor',
  confidence numeric,
  severity text not null default 'moderate',
  status text not null default 'unconfirmed',
  latitude numeric,
  longitude numeric,
  region text,
  detected_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.ops_flights (
  id uuid primary key default gen_random_uuid(),
  callsign text not null,
  aircraft_id uuid references public.fleet_aircraft(id) on delete set null,
  detection_id uuid references public.ops_detections(id) on delete set null,
  pilot_id uuid references auth.users(id) on delete set null,
  objective text,
  status text not null default 'planned',
  authorized_by uuid references auth.users(id) on delete set null,
  authorized_at timestamptz,
  payload_released boolean not null default false,
  departs_at timestamptz,
  returns_at timestamptz,
  outcome text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.ops_authorizations (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  authority text not null default 'FAA LAANC',
  kind text not null default 'laanc',
  region text,
  ceiling_ft integer,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'requested',
  flight_id uuid references public.ops_flights(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.prod_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  name text,
  target_date date,
  status text not null default 'planned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.prod_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null default 'autonomy',
  stage text not null default 'discovery',
  priority text not null default 'medium',
  owner_team text,
  release_id uuid references public.prod_releases(id) on delete set null,
  problem text,
  success_metric text,
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.prod_feedback (
  id uuid primary key default gen_random_uuid(),
  summary text not null,
  source_team text,
  impact text not null default 'medium',
  status text not null default 'new',
  feature_id uuid references public.prod_features(id) on delete set null,
  details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.exec_objectives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  quarter text not null,
  owner_team text,
  status text not null default 'on_track',
  progress integer not null default 0,
  narrative text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.exec_key_results (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid references public.exec_objectives(id) on delete cascade,
  title text not null,
  metric text,
  current_value numeric not null default 0,
  target_value numeric not null default 100,
  status text not null default 'on_track',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.exec_decisions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  context text,
  decision text,
  owner_team text,
  decided_on date,
  review_on date,
  status text not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.it_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'support',
  urgency text not null default 'normal',
  system text,
  requester_id uuid references auth.users(id) on delete set null,
  requester_team text,
  assignee_id uuid references auth.users(id) on delete set null,
  status text not null default 'open',
  details text,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.fund_donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null default 'individual',
  tier text not null default 'prospect',
  steward_id uuid references auth.users(id) on delete set null,
  email text,
  phone text,
  lifetime_amount numeric not null default 0,
  last_gift_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.fund_grants (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  funder text not null,
  amount numeric not null default 0,
  stage text not null default 'researching',
  submitted_on date,
  decision_on date,
  owner_id uuid references auth.users(id) on delete set null,
  program text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TABLE public.fund_donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references public.fund_donors(id) on delete set null,
  amount numeric not null default 0,
  received_on date not null default current_date,
  campaign text,
  restriction text not null default 'unrestricted',
  method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'team_requests','fleet_aircraft','fleet_maintenance','ops_detections','ops_flights',
    'ops_authorizations','prod_releases','prod_features','prod_feedback','exec_objectives',
    'exec_key_results','exec_decisions','it_requests','fund_donors','fund_grants','fund_donations'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)', t||'_read', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)', t||'_insert', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)', t||'_update', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.is_hq_admin(auth.uid()))', t||'_delete', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t||'_touch', t);
  END LOOP;
END $$;

CREATE INDEX ON public.team_requests (to_team, status);
CREATE INDEX ON public.ops_flights (status);
CREATE INDEX ON public.ops_detections (status);
CREATE INDEX ON public.it_requests (status);
