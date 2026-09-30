# Maxbet Foundation Decisions

Status: Approved foundation baseline.

## Product architecture
- One application/codebase with role-based customer and staff experiences.
- Public product catalogue; wholesale prices, live availability and purchasing require an approved account.
- One pharmacy/business maps to one customer login in V1. Pharmacy/licence and business-registration information are not collected during registration.
- Customer login will accept the registered phone number or email.
- Staff use individual accounts with a trusted-device model; sensitive actions may require stronger authentication.
- Starting staff groups: POS/Order Staff, Finance & Administration, Management, Super Admin, with granular permissions underneath.

## Technical architecture
- Monorepo: Next.js, TypeScript, React, Tailwind CSS, Supabase/PostgreSQL.
- Vercel is the intended web/PWA host.
- GitHub main represents approved production code; changes are developed on branches and merged after verification.
- Database changes are represented by migrations.
- The connected Maxbet Supabase project is treated as production; real operational data should not be introduced before relevant systems are tested.
- Ghana-first: GHS, Ghana phone normalization, Africa/Accra business timezone and unambiguous display dates.
- Responsive shared design system: mobile-first customer experience and desktop-optimized staff experience.

## Integrity and reliability
- Significant business, financial, security and administrative actions require an audit trail.
- Archive/deactivate/cancel is preferred to destructive deletion for business records.
- Historical financial facts are immutable; corrections use explicit adjustment transactions.
- External integrations use failure-tolerant, retry-first patterns.
- A centralized notification engine will coordinate in-app/PWA, email, WhatsApp and SMS.
- Central health/error monitoring is part of the platform; secrets and unnecessary sensitive data must not enter logs.
- Secrets never enter GitHub. Only safe variable names/templates are committed.

## Backup and recovery
- Maxbet will include an application-level, versioned, integrity-checked backup/export and restore system.
- Restore is initiated through Maxbet and writes validated data back into the underlying Supabase database.
- Restore operations are privileged, strongly authenticated and audited.
- Provider/database backups and GitHub code/migrations remain independent recovery layers.

## Planned major systems
Customer experience, admin operations, products, inventory, FEMSOL Local Bridge, orders, status workflows, pricing, communications, payments, invoices/documents, permissions, security, PWA, search/performance, business intelligence and financial analytics, settings, testing, deployment and launch are implemented in their dedicated phases.
