# khfullhd-web — Mobile Polish

**Date:** 2026-06-03
**Scope:** `khfullhd-web` only. No API changes, no new dependencies, no new app shell.

## Goal

Make the existing (already responsive) SvelteKit site genuinely good on phones:
collapse the overflowing navbar into a mobile drawer, fix touch interactions, and
hit 44px tap targets — without changing the desktop look.

## Problems (priority order)

1. **Navbar overflow** — logo + Browse + always-visible `w-44` search + Favorites +
   username + Sign out are all in one `gap-6` flex row; overflows at phone widths.
2. **Hover-only `MovieCard`** — `group-hover:scale-105` is dead weight on touch and
   causes sticky-hover after tap.
3. **Tap targets** — `py-2` controls (~34px) are below the 44px guideline
   (Navbar buttons, Pagination, Save button, SortSelect).
4. **Cramped inline search** — should become a clean mobile search.

## Design

### 1. Navbar → responsive with mobile drawer
- New `MobileDrawer.svelte`: slide-in from the **right**, dimmed backdrop,
  closes on `Escape` / backdrop tap, focus-trapped, `aria-expanded` on the toggle,
  body scroll locked while open.
- Desktop (`sm:`+): current navbar **unchanged**.
- Mobile (`<sm`): `[ logo ............. 🔍  ☰ ]`.
  - 🔍 reveals a full-width search row beneath the bar (tap-to-reveal).
  - ☰ opens the drawer: Browse, Favorites (if signed in), username, Sign in/out.

### 2. Touch targets
Consistent `min-h-11` (44px) on all interactive controls: Navbar buttons, drawer
links, Pagination Prev/Next, the Save button, SortSelect. Desktop appearance preserved.

### 3. `MovieCard` touch fix
Gate the scale-up behind `@media (hover: hover)`; add `active:scale-95` for tap
feedback. No layout change.

### 4. Mobile spacing
Slightly tighter grid gaps / `main` rhythm on `<sm`; larger Pagination buttons.

## Testing
- Add a Playwright **mobile project** (iPhone 13, 390px): drawer opens/closes,
  tap-to-reveal search works, nav is reachable.
- Existing vitest unit + load-function tests stay green.

## Files touched
`Navbar.svelte` (rewrite), new `MobileDrawer.svelte`, `MovieCard.svelte`,
`Pagination.svelte`, `SortSelect.svelte`, Save button in `movies/[id]/+page.svelte`,
`playwright.config.ts` + new e2e spec.
