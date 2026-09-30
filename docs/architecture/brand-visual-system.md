# Phase 2: Brand and visual system

Status: Implemented for visual review. The supplied identity is preserved; final visual approval is pending.

## Identity

The owner supplied `Picture1.png` on 30 September 2026 and confirmed there is no tagline. Its original bytes are retained in `apps/web/public/brand/maxbet-logo.png`. The 116 × 116 px raster is displayed at or below its native size; a higher-resolution source can replace it later without changing the design.

Green and blue lead the interface, drawn from the logo's visual identity. UI colours are intentional darker companions, not claims of exact original print specifications. Red remains in the original logo and is a restrained palette accent.

## Tokens and components

- Primary/action green: #007D42; hover/deep green: #005E33; soft green surface: #EDF7F0.
- Brand/focus blue: #282D83; red accent: #BB302D.
- Main text: #192D27; secondary text: #53655D; border: #DCE5DF; canvas: #F7F9F6.
- Arial/Helvetica system type: no remote font dependency. The original logo lettering is unchanged.
- Shared action links, labelled fields with hint/error associations, textual status badges, notices, header, footer, empty states and error pages.
- Customer layouts collapse to one column on phones. A native disclosure provides mobile navigation, usable without JavaScript.
- Keyboard focus rings, skip link, reduced-motion styles and labelled status states are included.

The `/brand` page is a component reference and is marked noindex. Example fields are read-only/disabled and do not collect data. Public page shells consistently explain the preview state. Prices, live availability and purchasing remain reserved for approved accounts, with no invented product data.

## Scope and next step

One monorepo continues from the verified foundation merged through PR #1. Phase 2 adds visual assets, components and public page shells. Authentication, business data, operational dashboards and database schemas remain dedicated later-phase work. There are no new Supabase changes.

Review the homepage and `/brand` reference before treating this visual direction as approved. The existing logo and no-tagline decision are fixed requirements; spacing, typography and page styling are reviewable choices.
