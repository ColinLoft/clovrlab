CREATE TABLE public.net_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  ai_model text NOT NULL DEFAULT 'google/gemini-2.5-flash',
  min_confidence integer NOT NULL DEFAULT 55,
  auto_promote boolean NOT NULL DEFAULT false,
  auto_promote_confidence integer NOT NULL DEFAULT 90,
  sweep_enabled boolean NOT NULL DEFAULT false,
  sweep_interval_hours integer NOT NULL DEFAULT 6,
  sweep_batch_size integer NOT NULL DEFAULT 25,
  sweep_priority_only boolean NOT NULL DEFAULT false,
  last_sweep_at timestamptz,
  sweep_lock_until timestamptz,
  paused boolean NOT NULL DEFAULT false,
  pause_reason text,
  dispatch_min_battery integer NOT NULL DEFAULT 40,
  dispatch_max_range_mi numeric NOT NULL DEFAULT 60,
  notify_on_suggestion boolean NOT NULL DEFAULT false,
  notify_on_incident boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT, INSERT, UPDATE ON public.net_settings TO authenticated;
GRANT ALL ON public.net_settings TO service_role;
ALTER TABLE public.net_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "net_settings_read" ON public.net_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "net_settings_write" ON public.net_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "net_settings_seed" ON public.net_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE TRIGGER net_settings_touch BEFORE UPDATE ON public.net_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.net_settings (id) VALUES (true);

CREATE TABLE public.net_camera_prefs (
  camera_id text PRIMARY KEY,
  camera_name text,
  watch boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  label text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.net_camera_prefs TO authenticated;
GRANT ALL ON public.net_camera_prefs TO service_role;
ALTER TABLE public.net_camera_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "net_camera_prefs_all" ON public.net_camera_prefs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER net_camera_prefs_touch BEFORE UPDATE ON public.net_camera_prefs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.net_sweep_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger text NOT NULL DEFAULT 'manual',
  analyzed integer NOT NULL DEFAULT 0,
  created_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  first_error text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.net_sweep_runs TO authenticated;
GRANT ALL ON public.net_sweep_runs TO service_role;
ALTER TABLE public.net_sweep_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "net_sweep_runs_read" ON public.net_sweep_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "net_sweep_runs_insert" ON public.net_sweep_runs FOR INSERT TO authenticated WITH CHECK (true);