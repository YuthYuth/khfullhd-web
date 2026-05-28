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

## Architecture

SvelteKit talks to FastAPI **server-side** via `src/lib/server/api.ts` from each
route's `+page.server.ts`. The browser never calls FastAPI directly — no CORS.
Auth is off in v1; adding a `Bearer` header in `api.ts` is the single seam for
the future Authentik login.
