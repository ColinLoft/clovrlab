SELECT cron.schedule('page-email-dispatch', '* * * * *', $$
  SELECT net.http_post(
    url := 'https://project--bb3b707d-fecc-4a18-be12-c9ddea559f35.lovable.app/api/public/net/page-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT token FROM private.cron_tokens WHERE name = 'net_sweep')
    ),
    body := '{}'::jsonb
  );
$$);