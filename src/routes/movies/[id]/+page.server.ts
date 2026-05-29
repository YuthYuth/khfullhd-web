import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getMovie, listFavoriteIds, addFavorite, removeFavorite } from '$lib/server/api';

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
  const token = session?.accessToken;
  let favorited = false;
  if (token) {
    const ids = await listFavoriteIds(event.fetch, token);
    favorited = ids.includes(id);
  }
  return { movie, signedIn: !!session?.user, favorited };
};

export const actions: Actions = {
  favorite: async (event) => {
    const session = await event.locals.auth();
    const token = session?.accessToken;
    if (!token) error(401, 'Sign in to save favorites');
    await addFavorite(event.fetch, movieId(event.params.id), token);
    return { favorited: true };
  },
  unfavorite: async (event) => {
    const session = await event.locals.auth();
    const token = session?.accessToken;
    if (!token) error(401, 'Sign in to save favorites');
    await removeFavorite(event.fetch, movieId(event.params.id), token);
    return { favorited: false };
  }
};
