import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getMovie, getRelated, listFavoriteIds, addFavorite, removeFavorite } from '$lib/server/api';
import type { Movie } from '$lib/types';
import { getAccessToken } from '$lib/server/session';

function movieId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    error(404, 'Movie not found');
  }
  return id;
}

export const load: PageServerLoad = async (event) => {
  const id = movieId(event.params.id);
  const movie = await getMovie(event.fetch, id);
  const session = await event.locals.auth();
  const token = await getAccessToken(event);
  let favorited = false;
  if (token) {
    const ids = await listFavoriteIds(event.fetch, token);
    favorited = ids.includes(id);
  }
  // recommendations are additive: if they fail, the detail page still renders
  let related: Movie[] = [];
  try {
    related = (await getRelated(event.fetch, id)).items;
  } catch {
    related = [];
  }
  return { movie, signedIn: !!session?.user, favorited, related };
};

export const actions: Actions = {
  favorite: async (event) => {
    const token = await getAccessToken(event);
    if (!token) error(401, 'Sign in to save favorites');
    await addFavorite(event.fetch, movieId(event.params.id), token);
    return { favorited: true };
  },
  unfavorite: async (event) => {
    const token = await getAccessToken(event);
    if (!token) error(401, 'Sign in to save favorites');
    await removeFavorite(event.fetch, movieId(event.params.id), token);
    return { favorited: false };
  }
};
