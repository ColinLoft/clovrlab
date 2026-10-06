# Clovr Lab

This project uses [TanStack Start](https://tanstack.com/start) with a [Supabase](https://supabase.com) backend.
Deployed to [Vercel](https://vercel.com).

## Development

```bash
bun install
bun run dev
```

## Database

Migrations live in `supabase/migrations/`. Apply them using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase db push
```
