CREATE TABLE public.sys_error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL DEFAULT 'web',
  path text,
  method text,
  status integer,
  message text NOT NULL,
  stack text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sys_error_log_created_idx ON public.sys_error_log (created_at DESC);
GRANT SELECT ON public.sys_error_log TO authenticated;
GRANT ALL ON public.sys_error_log TO service_role;
ALTER TABLE public.sys_error_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read system errors" ON public.sys_error_log
  FOR SELECT TO authenticated USING (private.is_hq_admin(auth.uid()));