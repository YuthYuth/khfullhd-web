# khfullhd-web

SvelteKit (SSR) front-end for the khfullhd movie catalog, served by `khfullhd-api`.

## Setup

```bash
npm install
cp .env.example .env   # set KHFULLHD_API_URL if the API isn't on :8000
```

## Run

Start the API first (in the khfullhd-api project): `uvicorn app.main:app --port 8000`.

```bash
npm run dev        # http://localhost:5173
```

## Test

```bash
npx vitest run       # unit (utils, API client, load functions)
npx playwright test  # e2e smoke (needs the API running on :8000)
```

## Authentication (v2)

Login uses Auth.js (@auth/sveltekit) with the Authentik OIDC provider. Catalog browse/search stay public; signing in only shows your identity in the navbar (no gated content yet — favorites are v3).

### Authentik setup (one-time, in the Authentik admin at http://localhost:9000)

1. Create an OAuth2/OpenID Provider + Application with slug `khfullhd-web`.
2. Client type: Confidential.
3. Redirect URI: `http://localhost:5173/auth/callback/authentik`.
4. Copy the client ID, client secret, and issuer (`http://localhost:9000/application/o/khfullhd-web/`) into `.env`:

```env
AUTH_SECRET=<npx auth secret or openssl rand -base64 33>
AUTH_AUTHENTIK_ID=<client id>
AUTH_AUTHENTIK_SECRET=<client secret>
AUTH_AUTHENTIK_ISSUER=http://localhost:9000/application/o/khfullhd-web/
```

The API must be running; it now allows anonymous reads, so public browse works whether or not you're signed in.

## Architecture

SvelteKit talks to FastAPI **server-side** via `src/lib/server/api.ts` from each
route's `+page.server.ts`. The browser never calls FastAPI directly — no CORS.
Auth is off in v1; adding a `Bearer` header in `api.ts` is the single seam for
the future Authentik login.
