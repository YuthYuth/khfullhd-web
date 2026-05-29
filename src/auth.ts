import { SvelteKitAuth } from '@auth/sveltekit';
import Authentik from '@auth/sveltekit/providers/authentik';

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Authentik],
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
