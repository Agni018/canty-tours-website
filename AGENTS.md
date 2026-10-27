# AGENTS.md

Project rules for AI coding assistants (Claude Code, Gemini CLI, GitHub Copilot, Cursor, Codex)
and for any developer taking over. `CLAUDE.md`, `GEMINI.md` and `.github/copilot-instructions.md`
point here; edit this file only.

## What this is

Marketing site for Canty Tours, a Kerala-first travel company. A home page (destination cards, a
filterable journey grid, a compare dialog, a trip planner) and one page per journey with its
day-by-day route and an enquiry form. Enquiries open WhatsApp with a prepared message. No backend,
no database, no stored personal data.

Journeys, "Where to?" places and travel styles are content the business edits itself in Pages CMS
(`.pages.yml`): JSON files in `content/`, read at build time by `src/lib/content.ts`. Every save
there is a commit to `main` that deploys.

## Stack

- Next.js (App Router) + React + TypeScript (strict), exported as static HTML (`output: "export"`)
- CSS Modules per component; design tokens in `src/app/globals.css`
- Vitest for unit tests, Prettier for formatting (default settings)
- Hosting: GitHub Pages via `.github/workflows/main.yml`

Don't add frameworks or libraries (Tailwind, UI kits, state libraries, CSS-in-JS) without the
owner agreeing first. Prefer what is already here.

## Commands

```sh
npm run dev      # local server at http://localhost:3000
npm test         # unit tests
npm run format   # Prettier
npm run check    # format check + tests + build — run before every commit
```

## Where things go

| Change                                | Place                                                 |
| ------------------------------------- | ----------------------------------------------------- |
| Journeys (content)                    | `content/journeys/<page-address>.json`                |
| "Where to?" places + credits          | `content/places/*.json`                               |
| Travel styles (the style filter)      | `content/styles/*.json`                               |
| Editing forms for `content/`          | `.pages.yml`                                          |
| Content types                         | `src/data/tours.ts`, `src/data/places.ts`             |
| Reading and checking content          | `src/lib/content.ts` + `content.test.ts`              |
| Journey pages (one per tour)          | `src/app/journeys/[id]/page.tsx`, `JourneyDetail.tsx` |
| Testimonials (real ones only)         | `src/data/testimonials.ts`                            |
| Dropdown options, regions, durations  | `src/data/options.ts`                                 |
| Destination cards                     | `src/data/destinations.ts`                            |
| Contact-form country codes            | `src/data/countryCodes.ts`                            |
| Phone / WhatsApp                      | `src/data/site.ts`                                    |
| Filtering, labels, message text       | `src/lib/journeys.ts` + `journeys.test.ts`            |
| Generic UI (buttons, fields, dialogs) | `src/components/ui/`                                  |
| Cards                                 | `src/components/cards/`                               |
| Page sections                         | `src/components/sections/`                            |
| Dialogs, bars, toasts                 | `src/components/overlays/`                            |
| Content + shared page state           | `src/components/JourneyProvider.tsx`                  |
| Photos                                | `public/assets/` (~1200px wide JPEG, <300 KB)         |

## Component rules

- Reuse `src/components/ui/` first: `Button` (variant, raised, small, arrow, href → link),
  `TextButton`, `Chip`, `Dropdown` (custom select; `boxed` inside forms; no native `<select>`),
  `Field` (labelled input or textarea), `Modal` (native dialog), `SectionHeading`, `Brand`,
  `Icon`. Extend one with a prop before creating a near-duplicate.
- Links between pages use `next/link` (`Button href`, `Brand` already do): it adds the base path.
- One component per file, named export, PascalCase file name, props typed with a `type`.
- Add `"use client"` only to components that use state, effects or event handlers.
- Content belongs in `src/data/`, not hard-coded in components, when it is a list or repeats.
- Components get journeys, places and travel styles from `useJourneys()` (client) or
  `getContent()` (server); never import `src/lib/content.ts` (it reads files) into a client
  component.
- A new field on journeys, places or styles goes in three places: the type in `src/data/`,
  `src/lib/content.ts`, and `.pages.yml`. Pages CMS deletes keys `.pages.yml` doesn't list.
- Logic without React (filtering, formatting, message building) goes in `src/lib/` with a test.
  Tests use their own sample data, not the entries in `content/`: the business edits those, and
  a failing test blocks its deploy.
- Use `asset("file.jpg")` for image URLs (adds the GitHub Pages base path). Use `<img>`, not
  `next/image` (image optimisation doesn't work in a static export).
- Keep the static export working: no API routes, server actions, middleware, cookies or headers.
  A backend means removing `output: "export"` and changing hosting; discuss that first.

## Styling rules

- Each component has a `Name.module.css` next to it; class names in camelCase.
- Use the tokens in `src/app/globals.css`; no raw hex text colours or pixel font sizes in
  components:
  - Colour (palette rationale in `globals.css`): neutrals `--cream`, `--surface`, `--sand`,
    `--line` (decorative edges), `--control` (input and chip edges, 3:1); palm green `--ink`,
    `--ink-hover`, `--green-soft`, `--muted`; saffron and marigold `--orange`, `--orange-hover`,
    `--marigold`, `--accent-dark`, `--accent-light`; text on dark `--on-dark`, `--on-dark-muted`.
    For a tint, use `color-mix(in srgb, var(--token) N%, transparent)`, not a new hex value.
  - Depth: buttons are flat; only the one main action of a screen or dialog gets `raised`.
  - Type: `--text-label` (12px uppercase labels, with `--tracking-label`), `--text-xs` 13,
    `--text-sm` 14, `--text-base` 16 (body and form controls), `--text-lg` 18, then fluid
    headings `--text-xl`, `--text-h3`, `--text-h2`, `--text-h1`, `--text-display`.
  - Fonts: `--serif` (Playfair Display) for headings and card titles, `--sans` (Montserrat) for everything
    else. Both are loaded by `next/font` in `src/app/layout.tsx`; italics are real italics.
- Text is never smaller than 12px. The only exception is the logo lockup in `Brand`.
- Breakpoints are `max-width` 1100px, 800px and 540px. Put a component's media queries at the end
  of its own module file.
- Global utility classes (`wrap`, `section`, `eyebrow`, `light`, `fineprint`) come from
  `globals.css`. Don't add new globals for a single component.
- To restyle a child component from its parent, pass `className` and target it with two classes
  (`.parent .child`) so it wins over the child's own single-class rule. Avoid `!important`.
- Keep visible focus outlines.

## Motion rules

- Use the motion tokens: `--ease-out` for things arriving, `--ease-in` for things leaving;
  `--dur-fast` (hover/press), `--dur-base` (state changes, exits), `--dur-slow` (dialogs,
  panels), `--dur-reveal` (page-load and scroll reveals). Exits are faster than entrances.
- Animate only `transform` and `opacity` (plus colours for hover states).
- Add the global `reveal` class to a block to fade it up as it scrolls into view (CSS scroll
  timeline, no JavaScript). Put it on containers, not on every card.
- Use one-shot animations with `backwards` fill so they never block hover transitions.
- `prefers-reduced-motion: reduce` turns all animation and transitions off in `globals.css`;
  never work around it, and never make content depend on an animation finishing.
- Keyframes used by a CSS Module must be defined in that module (names are scoped).

## Icons

- Use `<Icon name="arrow" />` (also `reset`, `spark`) instead of typing ↗ ↺ ✳: the fonts don't
  contain those glyphs, so they would render differently on every device. Add new icons as
  paths in `src/components/ui/Icon.tsx`. No emoji as icons.

## Content rules

- Prices are "on request". Never invent prices, reviews, testimonials, awards or guarantees.
- Routes are sample itineraries; keep the "confirmed in your quote" disclaimers.
- The trip form must not send or store data anywhere except the visitor's own WhatsApp message.
- Every image needs meaningful `alt` text. Credit a third-party photo in its `content/` entry's
  `credit` (the privacy dialog lists those itself); other photos in the README and privacy dialog.

## Before you finish

1. `npm run check` passes.
2. Look at the page at about 1440px, 800px and 390px wide (`npm run dev`).
3. Commit on a branch (never directly to `main`), one logical change per commit, message says
   what changed and why. Never commit `node_modules/`, `.next/`, `out/` or `.env*` files.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
