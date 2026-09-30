# Environment and deployment

Connected account: Maxbet. Project: `ufcerqtdlvtflvkkorzs`, region eu-central-1. The project has a generic dashboard name; its account and reference identify it. Do not use the unrelated TDK account.

A read-only database connectivity query succeeded on 30 September 2026. No schemas or operational data were changed.

Copy `apps/web/.env.example` to `apps/web/.env.local`. Next.js loads environment files from the web app directory. The foundation builds without credentials. Never commit real keys or expose privileged keys in browser variables.

Vercel: import the existing repository, set Root Directory to `apps/web`, enable access to files outside the root directory for workspace packages, select Node 22 and the Next.js preset. Install from the repository root using `npm ci`. Set preview and production variables separately. Actual deployment remains a separate step.

Customer and staff routes redirect to login. Real authorization, audit storage, backup/restore and integration monitoring remain dedicated later-phase work; placeholder routes do not imply those systems exist.
