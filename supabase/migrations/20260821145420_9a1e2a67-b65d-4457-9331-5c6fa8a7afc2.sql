-- Enums
CREATE TYPE public.net_incident_status AS ENUM ('new','triaging','dispatched','onscene','contained','closed','false_positive');
CREATE TYPE public.net_incident_priority AS ENUM ('p1','p2','p3','p4');
CREATE TYPE public.net_incident_source AS ENUM ('alertwest','firms','nws','usgs','user','manual','other');
CREATE TYPE public.net_drone_status AS ENUM ('ready','preflight','inflight','returning','charging','maintenance','offline');
CREATE TYPE public.net_maint_kind AS ENUM ('scheduled','unscheduled','inspection');
CREATE TYPE public.net_suggestion_status AS ENUM ('pending','promoted','dismissed');
CREATE TYPE public.net_suggestion_label AS ENUM ('smoke','fire','clear');

-- Airframes
CREATE TABLE public.net_airframes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL UNIQUE,
  manufacturer text,
  range_mi numeric NOT NULL DEFAULT 100,
  cruise_speed_mph numeric NOT NULL DEFAULT 90,
  retardant_capacity_l numeric NOT NULL DEFAULT 20,
  endurance_min integer NOT NULL DEFAULT 90,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_airframes TO authenticated;
GRANT ALL ON public.net_airframes TO service_role;
ALTER TABLE public.net_airframes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "airframes read" ON public.net_airframes FOR SELECT TO authenticated USING (true);
CREATE POLICY "airframes manage" ON public.net_airframes FOR ALL TO authenticated
  USING (public.is_hq_admin(auth.uid())) WITH CHECK (public.is_hq_admin(auth.uid()));
CREATE TRIGGER net_airframes_touch BEFORE UPDATE ON public.net_airframes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Bases
CREATE TABLE public.net_bases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  city text,
  state text,
  hangar_capacity integer NOT NULL DEFAULT 4,
  is_hq boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_bases TO authenticated;
GRANT ALL ON public.net_bases TO service_role;
ALTER TABLE public.net_bases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bases read" ON public.net_bases FOR SELECT TO authenticated USING (true);
CREATE POLICY "bases manage" ON public.net_bases FOR ALL TO authenticated
  USING (public.is_hq_admin(auth.uid())) WITH CHECK (public.is_hq_admin(auth.uid()));
CREATE TRIGGER net_bases_touch BEFORE UPDATE ON public.net_bases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Drones
CREATE TABLE public.net_drones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tail_number text NOT NULL UNIQUE,
  airframe_id uuid REFERENCES public.net_airframes(id) ON DELETE SET NULL,
  base_id uuid REFERENCES public.net_bases(id) ON DELETE SET NULL,
  status public.net_drone_status NOT NULL DEFAULT 'ready',
  battery_pct integer NOT NULL DEFAULT 100 CHECK (battery_pct BETWEEN 0 AND 100),
  retardant_l numeric NOT NULL DEFAULT 0,
  flight_hours numeric NOT NULL DEFAULT 0,
  last_lat numeric,
  last_lng numeric,
  heading_deg numeric,
  last_telemetry_at timestamptz,
  next_service_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_drones TO authenticated;
GRANT ALL ON public.net_drones TO service_role;
ALTER TABLE public.net_drones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drones read" ON public.net_drones FOR SELECT TO authenticated USING (true);
CREATE POLICY "drones insert" ON public.net_drones FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "drones update" ON public.net_drones FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "drones delete admin" ON public.net_drones FOR DELETE TO authenticated
  USING (public.is_hq_admin(auth.uid()));
CREATE TRIGGER net_drones_touch BEFORE UPDATE ON public.net_drones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Maintenance logs
CREATE TABLE public.net_maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drone_id uuid NOT NULL REFERENCES public.net_drones(id) ON DELETE CASCADE,
  kind public.net_maint_kind NOT NULL DEFAULT 'scheduled',
  description text NOT NULL,
  hours_at numeric,
  performed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX net_maintenance_logs_drone_idx ON public.net_maintenance_logs (drone_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_maintenance_logs TO authenticated;
GRANT ALL ON public.net_maintenance_logs TO service_role;
ALTER TABLE public.net_maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "maint read" ON public.net_maintenance_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "maint insert" ON public.net_maintenance_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "maint update" ON public.net_maintenance_logs FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "maint delete admin" ON public.net_maintenance_logs FOR DELETE TO authenticated
  USING (public.is_hq_admin(auth.uid()));

-- Incidents
CREATE TABLE public.net_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text,
  title text NOT NULL,
  source public.net_incident_source NOT NULL DEFAULT 'manual',
  status public.net_incident_status NOT NULL DEFAULT 'new',
  priority public.net_incident_priority NOT NULL DEFAULT 'p3',
  confidence smallint,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  county text,
  state text,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  acreage numeric,
  frp numeric,
  assigned_drone_id uuid REFERENCES public.net_drones(id) ON DELETE SET NULL,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, external_id)
);
CREATE INDEX idx_net_incidents_status ON public.net_incidents(status);
CREATE INDEX idx_net_incidents_discovered_at ON public.net_incidents(discovered_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_incidents TO authenticated;
GRANT ALL ON public.net_incidents TO service_role;
ALTER TABLE public.net_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incidents read" ON public.net_incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "incidents insert" ON public.net_incidents FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "incidents update" ON public.net_incidents FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "incidents delete admin" ON public.net_incidents FOR DELETE TO authenticated
  USING (public.is_hq_admin(auth.uid()));
CREATE TRIGGER net_incidents_touch BEFORE UPDATE ON public.net_incidents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Incident events
CREATE TABLE public.net_incident_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.net_incidents(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  message text,
  payload jsonb,
  actor uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_net_incident_events_incident ON public.net_incident_events(incident_id, created_at DESC);
GRANT SELECT, INSERT ON public.net_incident_events TO authenticated;
GRANT ALL ON public.net_incident_events TO service_role;
ALTER TABLE public.net_incident_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incident events read" ON public.net_incident_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "incident events append" ON public.net_incident_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Incident reports
CREATE TABLE public.net_incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES public.net_incidents(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  author uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_net_reports_incident ON public.net_incident_reports(incident_id);
CREATE INDEX idx_net_reports_created ON public.net_incident_reports(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_incident_reports TO authenticated;
GRANT ALL ON public.net_incident_reports TO service_role;
ALTER TABLE public.net_incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports read" ON public.net_incident_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "reports insert" ON public.net_incident_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reports update" ON public.net_incident_reports FOR UPDATE TO authenticated
  USING (public.is_hq_admin(auth.uid()) OR author = auth.uid())
  WITH CHECK (public.is_hq_admin(auth.uid()) OR author = auth.uid());
CREATE POLICY "reports delete admin" ON public.net_incident_reports FOR DELETE TO authenticated
  USING (public.is_hq_admin(auth.uid()));
CREATE TRIGGER net_reports_touch BEFORE UPDATE ON public.net_incident_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.net_auto_create_incident_report()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.net_incident_reports (incident_id, title, body, status, author)
  VALUES (NEW.id, 'Incident Report: ' || NEW.title, '', 'draft', NEW.created_by);
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.net_auto_create_incident_report() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER trg_net_auto_create_incident_report
AFTER INSERT ON public.net_incidents
FOR EACH ROW EXECUTE FUNCTION public.net_auto_create_incident_report();

-- AI suggestions
CREATE TABLE public.net_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  camera_id text,
  camera_name text,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  state text,
  county text,
  label public.net_suggestion_label NOT NULL,
  confidence smallint NOT NULL,
  reasoning text,
  image_url text,
  image_time timestamptz,
  status public.net_suggestion_status NOT NULL DEFAULT 'pending',
  incident_id uuid REFERENCES public.net_incidents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid
);
CREATE INDEX idx_net_suggestions_pending ON public.net_suggestions(status, created_at DESC);
CREATE UNIQUE INDEX idx_net_suggestions_recent_camera
  ON public.net_suggestions(camera_id, image_time)
  WHERE camera_id IS NOT NULL AND image_time IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.net_suggestions TO authenticated;
GRANT ALL ON public.net_suggestions TO service_role;
ALTER TABLE public.net_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suggestions read" ON public.net_suggestions FOR SELECT TO authenticated USING (true);
CREATE POLICY "suggestions insert" ON public.net_suggestions FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "suggestions update" ON public.net_suggestions FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Response area (singleton)
CREATE TABLE public.net_response_area (
  id boolean PRIMARY KEY DEFAULT true,
  mode text NOT NULL DEFAULT 'address',
  address text,
  center_lat numeric NOT NULL DEFAULT 37.5,
  center_lng numeric NOT NULL DEFAULT -120.0,
  radius_mi numeric NOT NULL DEFAULT 150,
  states text[] NOT NULL DEFAULT '{CA}',
  counties text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT net_response_area_singleton CHECK (id = true)
);
GRANT SELECT, INSERT, UPDATE ON public.net_response_area TO authenticated;
GRANT ALL ON public.net_response_area TO service_role;
ALTER TABLE public.net_response_area ENABLE ROW LEVEL SECURITY;
CREATE POLICY "area read" ON public.net_response_area FOR SELECT TO authenticated USING (true);
CREATE POLICY "area manage" ON public.net_response_area FOR ALL TO authenticated
  USING (public.is_hq_admin(auth.uid())) WITH CHECK (public.is_hq_admin(auth.uid()));
INSERT INTO public.net_response_area (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- Muted cameras
CREATE TABLE public.net_muted_cameras (
  camera_id text PRIMARY KEY,
  camera_name text,
  reason text,
  muted_until timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  muted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_muted_cameras TO authenticated;
GRANT ALL ON public.net_muted_cameras TO service_role;
ALTER TABLE public.net_muted_cameras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "muted read" ON public.net_muted_cameras FOR SELECT TO authenticated USING (true);
CREATE POLICY "muted manage" ON public.net_muted_cameras FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE public.net_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.net_incident_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.net_suggestions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.net_drones;