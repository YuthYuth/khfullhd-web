# khfullhd-app v2 — Native Login + Favorites

**Date:** 2026-06-03
**Decision:** Native OIDC (Authorization Code + PKCE, public client) reusing the existing
khfullhd-api Authentik client, plus a **dev-only demo login** so favorites are testable
without Authentik running.

> **Implementation note (pivot):** `@capacitor-community/generic-oauth2` was the chosen
> library, but its latest release (7.1.0) targets Capacitor **7** and conflicts with this
> app's Capacitor **8** plugins (capacitor-swift-pm version clash at SPM resolve). Pivoted to
> the **hand-rolled PKCE** alternative using `@capacitor/browser` + `@capacitor/app` (both
> Capacitor 8). Surface area was contained to `loginReal()`; demo/favorites/API unaffected.

## API change (khfullhd-api)

Dev-only auth bypass so the demo path works through the real favorites endpoints:

- New settings: `dev_auth_enabled: bool = False`, `dev_auth_token: str = "demo-token"`,
  `dev_auth_sub: str = "demo-user"`.
- In `auth.py`, before JWKS validation: if `auth_enabled` and `dev_auth_enabled` and the
  bearer equals `dev_auth_token`, return `{"sub": dev_auth_sub, "name": "Demo User"}`.
  Real tokens still go through full RS256 validation. Default off — never in production.
- Browse/search stay anonymous (`optional_token`); only `/favorites*` require a token.

## App (khfullhd-app)

- **`src/lib/auth.svelte.ts`** — reactive auth state `{ user, token, isAuthed }`, persisted
  with `@capacitor/preferences`:
  - `loginReal()` → generic-oauth2 PKCE against Authentik (native: ASWebAuthenticationSession;
    web: popup). Redirect `com.khfullhd.app://oauth/callback`.
  - `loginDemo()` → `token='demo-token'`, `user='Demo User'` (dev fallback).
  - `logout()`, `getToken()` (refresh real tokens on expiry), `restore()` on app start.
- **`src/lib/favorites.svelte.ts`** — reactive `Set<number>` of favorited ids; `hydrate()`
  from `/favorites/ids` after login; `toggle(id)` → `POST`/`DELETE /favorites/{id}`; clears on logout.
- **`src/lib/api.ts`** — favorites helpers send `Authorization: Bearer <token>`:
  `listFavorites`, `listFavoriteIds`, `addFavorite`, `removeFavorite`.
- **UI**
  - Detail page: Save/unsave button (authed) or "Sign in to save" (anon).
  - New `/favorites` route: lists saved movies via `/favorites` (reuses `MovieGrid`); empty +
    signed-out states.
  - Navbar drawer: Sign in / Demo login when anon; account label + Favorites + Sign out when authed.
- **Config**: `PUBLIC_OIDC_ISSUER`, `PUBLIC_OIDC_CLIENT_ID`; redirect scheme
  `com.khfullhd.app` registered in `ios/App/App/Info.plist` (CFBundleURLTypes).

## Data flow
login → token saved → favorites store hydrates from `/favorites/ids` → detail Save toggles →
`/favorites` route reads `/favorites`.

## Testing
- API: dev-auth unit test; manual run with `KHFULLHD_AUTH_ENABLED=true
  KHFULLHD_DEV_AUTH_ENABLED=true`, curl add/list/remove favorites with `demo-token`. Existing 52 green.
- App: `svelte-check` + build; browser preview demo-login → save → `/favorites` shows it (screenshot).
- Real Authentik: code complete; Docker + redirect-URI setup scripted/documented; user drives the
  live login dialog (interactive, not headless-automatable).

## Out of scope
Secure token storage (Preferences for now — hardening noted), Android intent-filter (iOS-first).
