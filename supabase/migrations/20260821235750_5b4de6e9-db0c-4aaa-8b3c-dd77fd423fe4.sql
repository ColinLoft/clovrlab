CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'net-camera-sweep',
  '7 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_APP_URL/api/public/net/sweep',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);