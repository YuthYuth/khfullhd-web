import { getToken } from '@auth/core/jwt';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

// Reads the Authentik access token from the encrypted JWT cookie, server-side only.
// The token is NEVER placed on the session object (so it can't leak via GET /auth/session).
export async function getAccessToken(event: RequestEvent): Promise<string | undefined> {
  const secret = env.AUTH_SECRET;
  if (!secret) return undefined;
  const token = await getToken({ req: event.request, secret, secureCookie: false });
  return (token as { accessToken?: string } | null)?.accessToken;
}
