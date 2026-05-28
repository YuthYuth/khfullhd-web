import type { PageServerLoad } from './$types';
import { isHttpError } from '@sveltejs/kit';
import { searchMovies } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();

  if (q.length < 2) {
    return { q, tooShort: true, unavailable: false, count: 0, movies: [] };
  }

  try {
    const result = await searchMovies(fetch, q, 24);
    return { q, tooShort: false, unavailable: false, count: result.count, movies: result.items };
  } catch (e) {
    if (isHttpError(e) && e.status === 503) {
      return { q, tooShort: false, unavailable: true, count: 0, movies: [] };
    }
    throw e;
  }
};
