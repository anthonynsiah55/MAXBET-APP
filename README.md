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
2. Copy `apps/web/.env.example` to `apps/web/.env.local` and provide the Maxbet public key.
3. Run `npm run dev`.

Never commit real credentials or production secrets.

See `docs/architecture/foundation.md` for the approved foundation baseline.

Verify with `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build`. Run the production build with `npm run start`.

Account and staff placeholders redirect to login until authentication and authorization are implemented. They contain no business data.

See `docs/architecture/environment.md` for the connected project and deployment settings.
