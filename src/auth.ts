import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    // Reuses the khfullhd-api Authentik app, which is a PUBLIC client (PKCE, no secret).
    Authentik({
      clientId: env.AUTH_AUTHENTIK_ID,
      issuer: env.AUTH_AUTHENTIK_ISSUER,
      clientSecret: '',
      client: { token_endpoint_auth_method: 'none' },
      checks: ['pkce', 'state']
    })
  ],
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {
      // Dormant seam for v3: keep the access token server-side (encrypted JWT).
      // NOT exposed to the client session and NOT forwarded to the API in v2.
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  }
});
