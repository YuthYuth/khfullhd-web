import type { PageServerLoad } from './$types';
import { listMovies } from '$lib/server/api';
import { offsetFor } from '$lib/utils';
import { SORT_KEYS, type SortKey } from '$lib/types';

const LIMIT = 24;

export const load: PageServerLoad = async ({ fetch, url }) => {
  const sortParam = url.searchParams.get('sort');
  const sort: SortKey = SORT_KEYS.includes(sortParam as SortKey) ? (sortParam as SortKey) : 'release_year_desc';
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);

  const data = await listMovies(fetch, { sort, limit: LIMIT, offset: offsetFor(page, LIMIT) });

  return { movies: data.items, total: data.total, limit: LIMIT, page, sort };
};
