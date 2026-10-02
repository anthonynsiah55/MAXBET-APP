# Phase 4: Customer Account & Verification

Status: In progress. Authentication, records/review, recovery and initial phone-linking code are implemented behind closed feature switches.

## Confirmed deployment — 2 October 2026

Project: MAXBET B2B APP, organization MAXBET PHARMACY, project ref ufcerqtdlvtflvkkorzs.
Live migration customer_accounts / 20261001044328 was found already installed. Its normalized SQL hash matches the repository migration (MD5 5761d7fa21a53372f3661c5f821f7569). Three account tables, six functions and the customer/reviewer read policies were verified. The local migration filename is now aligned to the existing remote history; do not apply it again or edit its contents.

Historical implementation notes below describe what was true when each increment was prepared; the deployment status above supersedes their earlier not-applied statements.

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

## Account records and staff review increment

Added migration 20261001042604_customer_accounts.sql (filename generated by Supabase CLI 2.119.0). It is NOT applied to the connected production project. The public schema was empty when inspected.

The migration creates only customer_accounts, account_review_events and a private reviewer allowlist. Customers can read only their own account and cannot directly mutate accounts or audit records. Submitted contacts come from verified Auth identity, not user metadata. A user can submit one account; exact business identity is established by staff review and the unique FEMSOL reference, not by assuming business names are unique.

Authorized reviewers can approve/decline pending applications, suspend/restore approved accounts, or reopen declined applications. Reviews reject self-approval, stale versions and reassignment of an existing FEMSOL link. Approval requires both currently verified contacts to match the submitted identity and a staff-checked unique FEMSOL reference. Review and audit insertion are one transaction. Reviewer revocation is read from the database on each request; it does not depend on stale JWT role claims.

Public RPCs are security-invoker wrappers. Narrow security-definer bodies live in the non-exposed maxbet_private schema, use an empty search path, check the caller and have explicit execute grants. The private schema must never be added to the Data API exposed schemas. Database administrators remain privileged; the audit trail is immutable to application roles, not to the database owner.

The gated /admin/accounts page and server action use a server-verified session and the database reviewer check. Account submission/status appears in /account only with MAXBET_ACCOUNT_RECORDS_ENABLED=true as well as authentication enabled. Both switches remain false by default. The initial queue is limited to 50 oldest updates; fuller operational navigation belongs to Phase 5.

### Verification and activation

CI uses disposable PostgreSQL 17, a minimal auth schema fixture and application roles. It applies the migration and tests anonymous denial, cross-customer isolation, unverified submission, direct-write denial, self-approval, reviewer revocation, duplicate links, stale updates, allowed transitions and immutable application audit records. This validates PostgreSQL rules, not the real Supabase Auth/PostgREST deployment.

Before activation, test against a non-production Supabase environment, run database advisors, confirm only public is exposed, apply the reviewed migration through the migration workflow, and provision named staff reviewers through a controlled administrator operation. No staff identity has been granted reviewer access by this work. Do not enable the switches until real contact verification, recovery, session behavior and reviewer operations are verified. Future wholesale queries must check current approval AND current verified matching contacts; a cached approved status alone is insufficient after contact changes.

## Recovery and phone linking — 2 October 2026

Added /recover and /account/verify-phone. Both are independently gated off, in addition to the main account switch.

Recovery uses resetPasswordForEmail followed by email + recovery OTP + new password. A fresh non-persisting Supabase client verifies type=recovery; it never uses the caller's existing browser session to authorize a password reset. Update occurs only after an eligible matching identity and recovery session are returned. The recovery session is signed out with global scope on completion; previously issued access tokens may remain valid until expiry, and revocation failures are not a guarantee of immediate logout. Generic request responses do not disclose whether an address exists or the provider failed. Passwords/codes are submitted only in POST bodies, never URLs or logs.

Activation prerequisite: configure the Reset Password email template to include {{ .Token }} (see supabase/templates/recovery.html), configure a trusted Site URL, test SMTP delivery, expiry/replay behavior, Supabase rate limits and abuse controls, then set MAXBET_RECOVERY_ENABLED=true. The default recovery-link template is not compatible with this code-entry interface. No email templates/settings were changed or real recovery messages sent by this increment.

Initial phone linking requires a current non-anonymous authenticated user and confirmed email. updateUser requests the code; verification uses Auth's new_phone field rather than a client-provided target number, with type=phone_change. It checks the returned owner and confirmed phone. Already-verified phone changes are intentionally not exposed here; they require a separate re-verification/review workflow. Provider enablement, actual SMS delivery, OTP expiry/replay and session-cookie tests remain prerequisites for MAXBET_PHONE_VERIFICATION_ENABLED=true.

Tests mock provider boundaries and check closed gates, recovery token type, identity mismatch, password mismatch, generic request responses, email verification before SMS, pending-phone binding and prevention of changing a verified phone. CI also checks the new routes, caching and anonymous redirects. These tests do not constitute live provider verification.
