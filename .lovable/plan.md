# Bearing refinement and release plan

## What will change
- Lighten the authenticated interface with quieter borders, tighter layouts, compact cards, restrained overlays, and more intentional navy/signal accents.
- Make Ask the strongest screen: executive headline, prominent 2px composer, focus ring, keyboard hint, and six icon-led prompt suggestions.
- Simplify the sidebar identity to the AWF mark plus “Bearing,” improve workspace wrapping, refresh every navigation icon, and keep client-side navigation compact.
- Make `/app/connections` canonical, redirect `/app/sources`, update all visible labels and links, and rebuild the page around six honest simulated integrations with local brand marks.
- Add a crisp AWF favicon and use it across sign-in and authenticated pages.
- Improve perceived navigation speed through route intent preloading, targeted post-sign-in preloading, and removal of unnecessary route-loading work where found.

## Technical details
- Preserve the current TanStack Start routing, seeded data, browser-local workspace state, decision/action audit behavior, and existing chart palette.
- Use individually imported Lucide icons and lightweight local SVG integration assets; no broad icon or UI-library imports.
- Update route metadata and all internal links to the canonical Connections route while retaining a redirect for the former Sources URL.
- Keep charts responsive and avoid repeated derived-data computation where profiling identifies it.

## Verification and release
- Verify demo sign-in, root redirect, Ask composer/focus/suggestions/answers/evidence, all navigation icons, AWF favicon, canonical Connections routing, six simulated integrations, search, CSV feedback, and client-side navigation without reloads.
- Test keyboard focus and widths 320, 375, 768, 1024, 1440, and 1920; inspect console/runtime errors.
- Run typecheck, lint, production build, and inspect output chunks.
- Fix material failures, then publish the existing project and report the exact live URL and demo credentials.
