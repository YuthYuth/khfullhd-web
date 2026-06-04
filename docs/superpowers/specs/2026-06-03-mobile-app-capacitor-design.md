# khfullhd — Mobile App (Capacitor, iOS-first)

**Date:** 2026-06-03
**Decision:** Capacitor wrap of a static SvelteKit SPA. iOS first (Xcode + CocoaPods
already installed). v1 = catalog only; login/favorites deferred to v2.

## Why a separate project

`khfullhd-web` is SSR (`adapter-node`) with a server BFF, server `load`, and server-side
Auth.js. Capacitor packages **static** files and runs them on-device with **no Node
server**, so the SSR/BFF/auth pieces can't run inside it. To avoid destabilizing the
tested web app, the app is a **new sibling project `khfullhd-app/`**.

## Architecture

- **SvelteKit static SPA:** `@sveltejs/adapter-static` + root `ssr = false` + SPA
  `fallback` → `index.html` + JS bundle that Capacitor packages.
- **UI reuse (copied from `khfullhd-web`):** `MovieCard`, `MovieGrid`, `PosterRow`,
  `Pagination`, `PosterPlaceholder`, the mobile `Navbar` + `MobileDrawer`, `types.ts`,
  `utils.ts`, and the Cinematic-Dark `layout.css`.
- **Client API client (`src/lib/api.ts`):** trimmed copy of `server/api.ts` — no
  `$env/private`, no kit `error()`. Base URL from `PUBLIC_API_URL` (build env).
  iOS Simulator reaches the Mac's `http://localhost:8000` directly.
- **Routes (universal `+page.ts`, client-side):** `/` browse (sort + pagination),
  `/movies/[id]` detail, `/search`.

## Native chrome (v1)
Status-bar styling, splash screen, app icon, safe-area insets (notch/home indicator).

## Backend change
Add CORS to `khfullhd-api`: allow `capacitor://localhost`, `http://localhost`,
`https://localhost`. FastAPI `CORSMiddleware`, config-driven, with a test. (Already a
v4 candidate.)

## Out of scope (v2)
Native Authentik OIDC login (PKCE + custom URL scheme) and favorites. Android build
(needs Android Studio + SDK install).

## Deliverable
Installable iOS app booting in the Simulator, browsing/searching the real catalog,
screenshotted.

## Testing
- `khfullhd-api`: new CORS test stays green with the existing 48.
- `khfullhd-app`: Playwright e2e over the static build (browse/search/detail render);
  `npx cap sync ios` succeeds; app boots in Simulator.
