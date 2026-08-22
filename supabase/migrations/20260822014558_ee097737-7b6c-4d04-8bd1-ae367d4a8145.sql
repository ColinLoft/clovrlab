GRANT SELECT, INSERT, UPDATE ON public.page_tickets TO authenticated;
GRANT ALL ON public.page_tickets TO service_role;
GRANT SELECT, INSERT ON public.page_ticket_notes TO authenticated;
GRANT ALL ON public.page_ticket_notes TO service_role;