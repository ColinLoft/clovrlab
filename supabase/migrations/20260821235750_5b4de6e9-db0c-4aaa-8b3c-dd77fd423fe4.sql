CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'net-camera-sweep',
  '7 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--bb3b707d-fecc-4a18-be12-c9ddea559f35.lovable.app/api/public/net/sweep',
    headers := '{"Content-Type": "application/json", "apikey": "sb_publishable_4IupizrjAgpXO7cTNIme4g_X-Hnovww"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);