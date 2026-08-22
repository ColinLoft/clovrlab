-- Queue separation: Mission Operations vs Enterprise Systems
ALTER TABLE public.page_alerts ADD COLUMN IF NOT EXISTS queue text NOT NULL DEFAULT 'ops';
ALTER TABLE public.oncall_rotations ADD COLUMN IF NOT EXISTS queue text NOT NULL DEFAULT 'ops';
ALTER TABLE public.page_targets ADD COLUMN IF NOT EXISTS push_sent_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.page_alerts ADD CONSTRAINT page_alerts_queue_chk CHECK (queue IN ('ops','systems'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.oncall_rotations ADD CONSTRAINT oncall_rotations_queue_chk CHECK (queue IN ('ops','systems'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Incident tickets raised from pages
CREATE SEQUENCE IF NOT EXISTS public.page_ticket_seq;

CREATE TABLE IF NOT EXISTS public.page_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL UNIQUE DEFAULT ('PG-' || lpad(nextval('public.page_ticket_seq')::text, 5, '0')),
  alert_id uuid UNIQUE REFERENCES public.page_alerts(id) ON DELETE SET NULL,
  queue text NOT NULL DEFAULT 'ops',
  title text NOT NULL,
  summary text,
  kind text,
  severity text NOT NULL DEFAULT 'critical',
  status text NOT NULL DEFAULT 'open',
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  impact text,
  root_cause text,
  resolution text,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_ticket_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.page_tickets(id) ON DELETE CASCADE,
  author_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_tickets_queue_idx ON public.page_tickets (queue, status, opened_at DESC);
CREATE INDEX IF NOT EXISTS page_ticket_notes_ticket_idx ON public.page_ticket_notes (ticket_id, created_at);
CREATE INDEX IF NOT EXISTS page_alerts_queue_idx ON public.page_alerts (queue, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_tickets TO authenticated;
GRANT ALL ON public.page_tickets TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_ticket_notes TO authenticated;
GRANT ALL ON public.page_ticket_notes TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.page_ticket_seq TO authenticated, service_role;

ALTER TABLE public.page_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_ticket_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tickets read staff" ON public.page_tickets;
CREATE POLICY "tickets read staff" ON public.page_tickets FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
DROP POLICY IF EXISTS "tickets write staff" ON public.page_tickets;
CREATE POLICY "tickets write staff" ON public.page_tickets FOR ALL TO authenticated
  USING (private.is_employee(auth.uid())) WITH CHECK (private.is_employee(auth.uid()));

DROP POLICY IF EXISTS "ticket notes read staff" ON public.page_ticket_notes;
CREATE POLICY "ticket notes read staff" ON public.page_ticket_notes FOR SELECT TO authenticated
  USING (private.is_employee(auth.uid()));
DROP POLICY IF EXISTS "ticket notes write staff" ON public.page_ticket_notes;
CREATE POLICY "ticket notes write staff" ON public.page_ticket_notes FOR INSERT TO authenticated
  WITH CHECK (private.is_employee(auth.uid()) AND author_id = auth.uid());

DROP TRIGGER IF EXISTS page_tickets_touch ON public.page_tickets;
CREATE TRIGGER page_tickets_touch BEFORE UPDATE ON public.page_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- raise_page: queue-aware routing + automatic ticket creation
CREATE OR REPLACE FUNCTION public.raise_page(
  _kind text, _title text, _body text DEFAULT NULL::text, _link text DEFAULT NULL::text,
  _severity text DEFAULT 'critical'::text, _source_table text DEFAULT NULL::text,
  _source_id uuid DEFAULT NULL::uuid, _queue text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_rot public.oncall_rotations%ROWTYPE;
  v_alert uuid;
  v_count int := 0;
  v_queue text;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT private.is_employee(auth.uid()) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  v_queue := coalesce(_queue, CASE WHEN _kind IN ('system','service','infrastructure','security') THEN 'systems' ELSE 'ops' END);

  SELECT * INTO v_rot FROM public.oncall_rotations
   WHERE active AND queue = v_queue AND (_kind = ANY(kinds) OR cardinality(kinds) = 0)
   ORDER BY (CASE WHEN _kind = ANY(kinds) THEN 0 ELSE 1 END), created_at
   LIMIT 1;

  INSERT INTO public.page_alerts (kind, severity, title, body, link, source_table, source_id, rotation_id, created_by, next_escalation_at, queue)
  VALUES (_kind, coalesce(_severity,'critical'), _title, _body,
          coalesce(_link, CASE WHEN v_queue = 'systems' THEN '/systems/paging' ELSE '/ops/paging' END),
          _source_table, _source_id, v_rot.id, auth.uid(),
          now() + (coalesce(v_rot.escalation_minutes, 5) || ' minutes')::interval, v_queue)
  RETURNING id INTO v_alert;

  IF v_rot.id IS NOT NULL THEN
    INSERT INTO public.page_targets (alert_id, user_id, level)
    SELECT v_alert, m.user_id, 1 FROM public.oncall_members m
     WHERE m.rotation_id = v_rot.id AND m.tier = 1
    ON CONFLICT DO NOTHING;
    GET DIAGNOSTICS v_count = ROW_COUNT;
  END IF;

  IF v_count = 0 THEN
    INSERT INTO public.page_targets (alert_id, user_id, level)
    SELECT DISTINCT v_alert, ur.user_id, 1 FROM public.user_roles ur
    ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.notifications (user_id, title, body, link)
  SELECT t.user_id, '🚨 ' || _title, coalesce(_body,''),
         coalesce(_link, CASE WHEN v_queue = 'systems' THEN '/systems/paging' ELSE '/ops/paging' END)
    FROM public.page_targets t WHERE t.alert_id = v_alert;

  -- every page opens a tracking ticket
  INSERT INTO public.page_tickets (alert_id, queue, title, summary, kind, severity, created_by)
  VALUES (v_alert, v_queue, _title, _body, _kind, coalesce(_severity,'critical'), auth.uid())
  ON CONFLICT (alert_id) DO NOTHING;

  RETURN v_alert;
END; $function$;

-- keep ticket status in step with the page
CREATE OR REPLACE FUNCTION public.page_ticket_follow_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'acked' AND OLD.status <> 'acked' THEN
    UPDATE public.page_tickets
       SET status = CASE WHEN status = 'open' THEN 'investigating' ELSE status END,
           assignee_id = coalesce(assignee_id, NEW.acked_by)
     WHERE alert_id = NEW.id;
  ELSIF NEW.status = 'resolved' AND OLD.status <> 'resolved' THEN
    UPDATE public.page_tickets
       SET status = CASE WHEN status IN ('open','investigating') THEN 'mitigated' ELSE status END
     WHERE alert_id = NEW.id;
  END IF;
  RETURN NEW;
END; $function$;

DROP TRIGGER IF EXISTS page_alerts_ticket_sync ON public.page_alerts;
CREATE TRIGGER page_alerts_ticket_sync AFTER UPDATE ON public.page_alerts
  FOR EACH ROW EXECUTE FUNCTION public.page_ticket_follow_alert();

REVOKE ALL ON FUNCTION public.page_ticket_follow_alert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.raise_page(text,text,text,text,text,text,uuid,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.raise_page(text,text,text,text,text,text,uuid,text) TO authenticated, service_role;

-- backfill tickets for existing pages
INSERT INTO public.page_tickets (alert_id, queue, title, summary, kind, severity, opened_at, status)
SELECT a.id, coalesce(a.queue,'ops'), a.title, a.body, a.kind, a.severity, a.created_at,
       CASE WHEN a.status = 'resolved' THEN 'mitigated' WHEN a.status = 'acked' THEN 'investigating' ELSE 'open' END
FROM public.page_alerts a
ON CONFLICT (alert_id) DO NOTHING;

-- default rotations, one per queue
UPDATE public.oncall_rotations SET queue = 'systems'
 WHERE queue = 'ops' AND (workspace = 'systems' OR 'system' = ANY(kinds));