# Realtor Kit — Next.js + Supabase + Razorpay

Full UI + Supabase auth/quota + API routes. Razorpay stubs included (safe to ignore until live URL).

## Quick start
```bash
npm i
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Supabase
- Run `supabase/schema.sql` in the SQL editor
- Enable Email auth (magic link); add Google if needed
- Set Site URL to your dev/Vercel URL

## API routes
- `POST /api/generate` — create kit
- `GET /api/kits/:id` — fetch kit
- `POST /api/reveal` — decrement free quota
- `POST /api/unlock-extra` — +1 free
- `GET /api/me` — current user + quota
- Razorpay (later): `/api/razorpay/checkout` and `/api/razorpay/webhook`

## Env
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_SUPPORT_EMAIL` (optional)

## Deploy
- Push to Vercel, set env, deploy
- Set Razorpay webhook to `/api/razorpay/webhook` when ready