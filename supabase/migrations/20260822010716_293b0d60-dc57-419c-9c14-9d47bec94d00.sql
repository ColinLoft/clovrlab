SELECT cron.schedule('page-email-dispatch', '* * * * *', $$
  SELECT net.http_post(
    url := 'https://YOUR_APP_URL/api/public/net/page-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT token FROM private.cron_tokens WHERE name = 'net_sweep')
    ),
    body := '{}'::jsonb
  );
$$);