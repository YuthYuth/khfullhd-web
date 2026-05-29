import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();
  // Return only the user — never the access token — to the browser.
  return { user: session?.user ?? null };
};
