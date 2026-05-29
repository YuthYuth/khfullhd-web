import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { listFavorites, removeFavorite } from '$lib/server/api';
import { getAccessToken } from '$lib/server/session';

export const load: PageServerLoad = async (event) => {
  const token = await getAccessToken(event);
  if (!token) {
    redirect(303, '/');
  }
  const { items } = await listFavorites(event.fetch, token);
  return { movies: items };
};

export const actions: Actions = {
  unfavorite: async (event) => {
    const token = await getAccessToken(event);
    if (!token) {
      redirect(303, '/');
    }
    const form = await event.request.formData();
    const id = Number(form.get('movie_id'));
    if (Number.isInteger(id) && id > 0) {
      await removeFavorite(event.fetch, id, token);
    }
    return { removed: true };
  }
};
