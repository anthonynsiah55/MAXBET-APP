# Phase 3: Customer-facing frontend

Status: Implemented for review.

## Scope

The approved roadmap places customer-facing browsing before account services, product management and the production database design. Phase 3 therefore implements the public experience using clearly labelled presentation-only sample items.

- Public homepage category entry points, About and Help pages, responsive navigation and breadcrumbs.
- Catalogue cards, category selection, basic name/reference search, alphabetical sorting, pagination and a helpful no-results state.
- Shareable GET query parameters preserve filters and pagination across refresh, browser history and copied links. Search works without JavaScript; invalid categories/sorts/page values normalize safely. Query length is capped.
- Sample detail pages, related samples, category navigation and unknown-item 404s.
- Existing account information and sign-in placeholders remain explicit about upcoming services. No password, enquiry, payment or application collection.

`src/lib/catalogue/preview.ts` is deliberately a presentation fixture, not a product database model. It contains no prices, quantities, stock states, real SKUs, brands or medical guidance. Each card/detail is labelled Sample; catalogue and detail pages are noindex. Packaging is neutral CSS illustration, never presented as an actual product photograph.

The public-only data shape prevents accidental price/stock serialization. Approved-account access controls must be implemented before any real wholesale data is loaded. Phase 19 will build the production search/indexing/performance implementation; this phase demonstrates controls on a nine-item fixture.

## Verification

Production smoke tests exercise search, combined filters, sort, pagination, empty states, malformed queries, sample detail routes, unknown-item 404s and access redirects. Visual checks cover desktop and mobile browsing. The approved green/blue system and original logo continue unchanged.

## Next phase

Phase 4 is Customer Account & Verification: registration, approval, login, profile and FEMSOL customer linking. Before implementing production-backed account workflows, define their exact data and authorization boundaries within that phase; do not infer a complete later-phase product, inventory or order schema from these UI fixtures.
