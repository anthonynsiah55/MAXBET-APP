# Phase 4: Customer Account & Verification

Status: In progress. First increment is a non-collecting registration and review-state interface.

## Confirmed requirements

- Owner decision, 1 October 2026: both phone and email are required.
- One customer login per pharmacy/business in V1.
- Sign-in will support the registered phone number or email.
- No pharmacy licence or business registration document collection at signup.
- Staff approval is required before wholesale services become available.
- FEMSOL customer linking belongs to this phase's account boundary; synchronization and the Local Bridge remain Phase 8.

## Interface implemented

Registration shows business name, contact person, phone and email. Fields are disabled, outside a form, and do not submit or store information. Password collection waits for the verified authentication implementation. /account-preview presents verification, pending, approved, declined and suspended messages as explicitly illustrative states. Its URL parameter is presentation only and never an authorization input. The preview is noindex.

## Next implementation boundaries

Use only connected Maxbet Supabase project ufcerqtdlvtflvkkorzs. Before opening registration, implement verified identity, server-side validation, safe sessions, contact verification/recovery and staff-only approval. Establish the phone verification provider and email delivery configuration before promising delivery. Format validation does not prove contact ownership.

Keep identity, business approval and FEMSOL linking separate. Self-editable user metadata and browser-provided status must never grant approval, roles or customer links. Staff decisions must be authorized server-side and audited. Pending, declined and suspended accounts must not receive wholesale data. Link a verified FEMSOL reference through authorized staff; a customer-supplied reference is not proof of ownership. Define uniqueness/conflict handling before enabling links.

Introduce only minimal account-specific persistence and RLS through reviewed migrations. Do not infer product, inventory, order, credit or finance schemas. No production schema or authentication settings changed in this increment.

## Remaining completion criteria

Real signup/sign-in/sign-out, contact verification, recovery, private profile, server-enforced approval, staff review, audited FEMSOL linking, duplicate-business handling and negative authorization tests. Phase 4 remains incomplete until these are implemented and verified against the correct project.

## Authentication implementation increment (1 October 2026)

Implemented server-side email/password signup with mandatory normalized Ghana phone and email, phone-or-email password sign-in, PKCE callback, local sign-out, request-scoped cookie clients, session refresh middleware and a private account setup page. These routes remain closed by default behind MAXBET_ACCOUNTS_ENABLED. No production settings or schema were changed.

Read-only provider inspection: Maxbet project is healthy, signup enabled, email enabled, email auto-confirmation disabled, phone enabled=false and phone auto-confirmation disabled. SMS/provider setup is therefore still required. SMTP delivery limits and redirects have not yet been verified.

Signup stores business/contact/requested-phone metadata only as unverified application details. It never writes approval or roles. The phone becomes an authentication identifier only after a future authenticated phone-link/OTP flow. Auth metadata is not the final business application record. One-business-per-login uniqueness and staff review require account-specific persistence before public launch.

Next steps: email delivery/redirect configuration, verified phone linking, password recovery, account application persistence and duplicate handling, RLS, authorized staff decisions and audited FEMSOL links. Keep the feature switch false until those paths and real session/provider behavior are tested. Do not interpret passing mocked provider tests as live authentication verification.

Local tests cover normalization, invalid/absent contacts, password byte limits, wrong-project rejection, disabled registration, allowlisted signup metadata, sign-in identity conversion and generic provider failures. CI also checks production builds, private no-store headers, and fixed callback destinations.

Documentation checked: Supabase changelog (1 October 2026), advanced SSR guide https://supabase.com/docs/guides/auth/server-side/advanced-guide and Next.js guide. The installed SSR 0.7.0 predates automatic refresh cache headers, so middleware explicitly sets private, no-store.
