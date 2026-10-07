# OpenKuasa OS

A rebuild of the Kuasa OS web surface on a modern stack.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**, **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives, `radix-nova` preset)
- **Supabase** (`@supabase/ssr`) for data, auth, and tenancy

## Getting Started

Requires Node 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file in the project root with your Supabase project's
values (Supabase dashboard → Project Settings → API):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Until these are set, the app runs normally but the Supabase auth middleware is a
no-op — see `src/lib/supabase/middleware.ts`.

## Supabase helpers

- `src/lib/supabase/client.ts` — browser client (Client Components)
- `src/lib/supabase/server.ts` — server client (Server Components, Route Handlers, Server Actions)
- `src/lib/supabase/middleware.ts` + `src/middleware.ts` — session refresh

## Scripts

```bash
pnpm dev      # start the dev server
pnpm build    # production build
pnpm start    # run the production build
pnpm lint     # eslint
```
