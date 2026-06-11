import type { PageServerLoad } from './$types';
import { getSuggestions, listMovies } from '$lib/server/api';
import { getAccessToken } from '$lib/server/session';
import type { Movie } from '$lib/types';

export const load: PageServerLoad = async (event) => {
  const [topRated, newest] = await Promise.all([
    listMovies(event.fetch, { sort: 'rating_desc', limit: 18 }),
    listMovies(event.fetch, { sort: 'release_year_desc', limit: 18 })
  ]);
  // personalized row: only for signed-in users with favorites; never breaks the page
  let suggested: Movie[] = [];
  try {
    const token = await getAccessToken(event);
    if (token) {
      suggested = (await getSuggestions(event.fetch, token)).items;
    }
  } catch {
    suggested = []; // any session/API hiccup just means an anonymous home page
  }
  return { topRated: topRated.items, newest: newest.items, suggested };
};
