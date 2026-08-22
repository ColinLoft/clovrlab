CREATE TABLE public.push_topics (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_topics TO authenticated;
GRANT ALL ON public.push_topics TO service_role;

ALTER TABLE public.push_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own push topic"
ON public.push_topics FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER push_topics_updated_at BEFORE UPDATE ON public.push_topics
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();