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
