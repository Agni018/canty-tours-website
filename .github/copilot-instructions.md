# Copilot instructions

The full project rules are in `AGENTS.md` at the repository root. Read and follow it; it is the
single source of truth shared by Claude, Gemini, Copilot and other assistants.

Key points, in case `AGENTS.md` is not loaded:

- Next.js App Router + React + TypeScript (strict), static export (`output: "export"`), no backend.
- Reuse components in `src/components/ui/` (Button, TextButton, Chip, Select, Field, Modal,
  SectionHeading, Brand, Icon) before writing new ones.
- Styles: one `*.module.css` per component, colour/type/motion tokens from
  `src/app/globals.css` (no raw px font sizes, nothing under 12px), breakpoints 1100/800/540px.
- Motion: `--ease-out`/`--ease-in` and `--dur-*` tokens, transform/opacity only, `reveal` class
  for scroll fade-ins, reduced motion respected. Use `<Icon name="arrow" />`, not ↗.
- Content in `src/data/`, pure logic in `src/lib/` with Vitest tests.
- Images via `asset()` and plain `<img>`. No new dependencies without the owner agreeing.
- Never invent prices, reviews or claims. Run `npm run check` before committing.
