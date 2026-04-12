# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start Next.js dev server (loads .env.local automatically)
npm run build         # Production build
npm run lint          # ESLint

npm run db:generate   # Generate Drizzle migration after schema changes
npm run db:migrate    # Apply migrations (loads .env.local via --env-file)
npm run db:seed       # Seed default categories for unseeded families
npm run db:studio     # Open Drizzle Studio GUI at https://local.drizzle.studio

npx tsc --noEmit      # Type-check without building
```

## Local development prerequisites

- **PostgreSQL**: Docker container `finanshal-pg` on port 5433.
  Start with: `docker start finanshal-pg`
  First-time: `docker run -d --name finanshal-pg -e POSTGRES_USER=finanshal -e POSTGRES_PASSWORD=finanshal -e POSTGRES_DB=finanshal -p 5433:5432 postgres:16-alpine`
- **`.env.local`**: Must exist with `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`. See `.env.example`.

## Architecture

### Auth — Better Auth
- **`src/lib/auth.ts`** — server-side auth instance. Uses `drizzleAdapter` with `databaseHooks` to auto-create a family group and seed default categories when a new user signs in via Google OAuth.
- **`src/lib/auth-client.ts`** — browser-side client (`createAuthClient`). Import `authClient` here for `signIn.social()`, `signOut()`, `useSession()` in client components.
- **`src/app/api/auth/[...all]/route.ts`** — single catch-all handler via `toNextJsHandler(auth)`.
- **Middleware** (`middleware.ts`): checks for `better-auth.session_token` cookie; redirects unauthenticated requests to `/login`.
- **Session in server components/API routes**: `await auth.api.getSession({ headers: await headers() })` — always import `headers` from `next/headers`.

### Database — Drizzle ORM + PostgreSQL
- **`src/lib/db/schema.ts`** — single source of truth for all tables. Better Auth tables (`user`, `session`, `account`, `verification`) plus app tables (`family_groups`, `categories`, `transactions`, `budgets`, `family_invites`).
- **`src/lib/db/index.ts`** — exports `db` (postgres.js + drizzle). Import this everywhere for DB access.
- **`src/lib/db/seed.ts`** — `seedDefaultCategories(familyId)` — called automatically on new user creation and available for manual seeding via `seed-run.ts`.
- After any schema change: run `db:generate` then `db:migrate`.

### Data model — family-scoped
Every piece of app data belongs to a `family_group`. Users have a `familyId` on their `user` row. All queries must filter by `familyId` — it is never derived from the session alone; it is read from `session.user.familyId` (cast as `{ familyId?: string }`).

### i18n — React Context
- **`src/lib/i18n/translations.ts`** — all UI strings in `en` and `id` objects. Add new keys to both languages here.
- **`src/lib/i18n/context.tsx`** — `LangProvider` (wraps root layout) + `useLang()` hook returning `{ lang, setLang, t }`. `t("dot.notation.key")` resolves nested keys.
- **Server components** cannot call `useLang()` directly. Use `<PageHeader titleKey="..." subtitleKey="..." />` (`src/components/layout/PageHeader.tsx`) instead.
- Language preference persists in `localStorage` under key `finanshal_lang`. Default is `"en"`.

### WhatsApp bot — stays Indonesian
- **`src/lib/whatsapp/parser.ts`** — NLP parser for Indonesian free-text expense messages. Keyword maps (`CATEGORY_HINTS`, `NUMBER_WORDS`) must remain in Bahasa Indonesia.
- **`src/lib/whatsapp/sender.ts`** — bot reply messages are in Indonesian. Do not translate these.
- Webhook entry: `src/app/api/webhook/whatsapp/route.ts` — looks up user by `phoneNumber`, parses message, saves transaction, sends confirmation, checks budget alert.

### API routes pattern
All protected routes follow this pattern:
```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const session = await auth.api.getSession({ headers: await headers() });
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const familyId = (session.user as { familyId?: string }).familyId;
```

### Key utilities (`src/lib/utils.ts`)
- `generateId()` — `crypto.randomUUID()`, used for all primary keys
- `formatCurrency(amount, currency)` — `id-ID` locale formatting
- `getCurrentMonthYear()` — returns `"YYYY-MM"` string used as budget period key
