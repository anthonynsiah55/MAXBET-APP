# MAXBET-APP

Maxbet is a Ghana-first B2B wholesale pharmacy platform.

## Repository structure

- `apps/web` — customer and staff Next.js PWA
- `services/femsol-bridge` — reserved local FEMSOL synchronization service
- `packages/shared` — shared types and utilities
- `supabase` — versioned migrations and Edge Functions
- `docs/architecture` — approved architecture decisions and system documentation

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to a local `.env` and provide the required Supabase values.
3. Run `npm run dev`.

Never commit real credentials or production secrets.

See `docs/architecture/foundation.md` for the approved foundation baseline.
