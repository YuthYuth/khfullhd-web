import { getToken, encode } from '@auth/core/jwt';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

const COOKIE = 'authjs.session-token';
const SKEW_MS = 30_000;

interface AppJwt {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number; // epoch seconds
  [key: string]: unknown;
}

// Reads the Authentik access token from the encrypted JWT cookie (server-side only),
// refreshing it via the refresh token when expired and persisting the rotated tokens
// back to the cookie. The token is never placed on the session (no /auth/session leak).
export async function getAccessToken(event: RequestEvent): Promise<string | undefined> {
  const secret = env.AUTH_SECRET;
  if (!secret) return undefined;

  const token = (await getToken({ req: event.request, secret, secureCookie: false })) as AppJwt | null;
  if (!token?.accessToken) return undefined;

  const expiresMs = (token.expiresAt ?? 0) * 1000;
  if (expiresMs - SKEW_MS > Date.now()) {
    return token.accessToken; // still valid
  }

  if (!token.refreshToken || !env.AUTH_AUTHENTIK_ISSUER || !env.AUTH_AUTHENTIK_ID) {
    return token.accessToken; // cannot refresh — best effort
  }

  const tokenUrl = new URL('../token/', env.AUTH_AUTHENTIK_ISSUER).toString();
  let data: { access_token?: string; refresh_token?: string; expires_in?: number };
  try {
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: env.AUTH_AUTHENTIK_ID
      })
    });
    if (!resp.ok) return undefined;
    data = await resp.json();
  } catch {
    return undefined;
  }
  if (!data.access_token) return undefined;

  const rotated: AppJwt = {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 0)
  };
  const encoded = await encode({ token: rotated, secret, salt: COOKIE });
  event.cookies.set(COOKIE, encoded, { path: '/', httpOnly: true, sameSite: 'lax', secure: false });
  return data.access_token;
}
