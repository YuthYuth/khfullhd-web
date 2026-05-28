import type { PageServerLoad } from './$types';
import { listMovies } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch }) => {
  const [topRated, newest] = await Promise.all([
    listMovies(fetch, { sort: 'rating_desc', limit: 18 }),
    listMovies(fetch, { sort: 'release_year_desc', limit: 18 })
  ]);
  return { topRated: topRated.items, newest: newest.items };
};
