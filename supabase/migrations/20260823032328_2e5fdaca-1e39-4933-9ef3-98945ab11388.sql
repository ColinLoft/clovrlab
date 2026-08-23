-- 1. ack tokens + delivery state on page targets
ALTER TABLE public.page_targets
  ADD COLUMN IF NOT EXISTS ack_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS acked_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS page_targets_ack_token_idx ON public.page_targets(ack_token);

ALTER TABLE public.page_tickets
  ADD COLUMN IF NOT EXISTS acked_at timestamptz,
  ADD COLUMN IF NOT EXISTS acked_by uuid;

ALTER TABLE public.push_topics
  ADD COLUMN IF NOT EXISTS last_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_ack_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked boolean NOT NULL DEFAULT false;

-- 2. delivery timeline
CREATE TABLE IF NOT EXISTS public.page_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.page_alerts(id) ON DELETE CASCADE,
  target_id uuid,
  user_id uuid,
  channel text NOT NULL,
  status text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS page_deliveries_alert_idx ON public.page_deliveries(alert_id, created_at DESC);
GRANT SELECT ON public.page_deliveries TO authenticated;
GRANT ALL ON public.page_deliveries TO service_role;
ALTER TABLE public.page_deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "staff read page deliveries" ON public.page_deliveries;
CREATE POLICY "staff read page deliveries" ON public.page_deliveries
  FOR SELECT TO authenticated USING (private.is_employee(auth.uid()));

-- 3. admins may manage operator push topics
DROP POLICY IF EXISTS "admins manage push topics" ON public.push_topics;
CREATE POLICY "admins manage push topics" ON public.push_topics
  FOR ALL TO authenticated
  USING (public.is_hq_admin(auth.uid()))
  WITH CHECK (public.is_hq_admin(auth.uid()));

-- 4. acknowledging a page also stamps the ticket
CREATE OR REPLACE FUNCTION public.ack_page(_alert_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT private.is_employee(auth.uid()) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.page_alerts
     SET status = CASE WHEN status = 'open' THEN 'acked' ELSE status END,
         acked_by = coalesce(acked_by, auth.uid()),
         acked_at = coalesce(acked_at, now()),
         next_escalation_at = NULL
   WHERE id = _alert_id;
  UPDATE public.page_targets
     SET seen_at = coalesce(seen_at, now()), acked_at = coalesce(acked_at, now())
   WHERE alert_id = _alert_id AND user_id = auth.uid();
  UPDATE public.page_tickets
     SET acked_at = coalesce(acked_at, now()), acked_by = coalesce(acked_by, auth.uid()),
         status = CASE WHEN status = 'open' THEN 'investigating' ELSE status END
   WHERE alert_id = _alert_id;
  UPDATE public.push_topics SET last_ack_at = now() WHERE user_id = auth.uid();
  INSERT INTO public.page_deliveries (alert_id, user_id, channel, status, detail)
  VALUES (_alert_id, auth.uid(), 'app', 'acknowledged', 'Acknowledged in console');
END; $$;

-- 5. acknowledge straight from an ntfy action button (token-authenticated)
CREATE OR REPLACE FUNCTION public.ack_page_by_token(_token uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.page_targets%ROWTYPE;
BEGIN
  SELECT * INTO t FROM public.page_targets WHERE ack_token = _token;
  IF t.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'unknown token'); END IF;

  UPDATE public.page_targets
     SET acked_at = coalesce(acked_at, now()), seen_at = coalesce(seen_at, now())
   WHERE id = t.id;
  UPDATE public.page_alerts
     SET status = CASE WHEN status = 'open' THEN 'acked' ELSE status END,
         acked_by = coalesce(acked_by, t.user_id),
         acked_at = coalesce(acked_at, now()),
         next_escalation_at = NULL
   WHERE id = t.alert_id;
  UPDATE public.page_tickets
     SET acked_at = coalesce(acked_at, now()), acked_by = coalesce(acked_by, t.user_id),
         status = CASE WHEN status = 'open' THEN 'investigating' ELSE status END
   WHERE alert_id = t.alert_id;
  UPDATE public.push_topics SET last_ack_at = now() WHERE user_id = t.user_id;
  INSERT INTO public.page_deliveries (alert_id, target_id, user_id, channel, status, detail)
  VALUES (t.alert_id, t.id, t.user_id, 'ntfy', 'acknowledged', 'Acknowledged from push notification');
  RETURN jsonb_build_object('ok', true, 'alert_id', t.alert_id);
END; $$;
REVOKE ALL ON FUNCTION public.ack_page_by_token(uuid) FROM PUBLIC, anon, authenticated;