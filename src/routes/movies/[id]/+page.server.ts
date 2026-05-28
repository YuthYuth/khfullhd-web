import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getMovie } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw error(404, 'Movie not found');
  }
  const movie = await getMovie(fetch, id);
  return { movie };
};
