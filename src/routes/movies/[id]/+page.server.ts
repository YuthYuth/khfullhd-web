import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { getComments, getMovie, getRelated, listFavoriteIds, postComment, addFavorite, removeFavorite } from '$lib/server/api';
import type { CommentItem, Movie } from '$lib/types';
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
  // favorites are additive: a stale/expired token must not 502 the movie page
  let favorited = false;
  if (token) {
    try {
      const ids = await listFavoriteIds(event.fetch, token);
      favorited = ids.includes(id);
    } catch {
      favorited = false;
    }
  }
  // recommendations are additive: if they fail, the detail page still renders
  let related: Movie[] = [];
  try {
    related = (await getRelated(event.fetch, id)).items;
  } catch {
    related = [];
  }
  // comments too: sqlite fallback (or an API hiccup) just means an empty list
  let comments: CommentItem[] = [];
  try {
    comments = (await getComments(event.fetch, id)).items;
  } catch {
    comments = [];
  }
  return { movie, signedIn: !!session?.user, favorited, related, comments };
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
  },
  comment: async (event) => {
    const token = await getAccessToken(event);
    if (!token) error(401, 'Sign in to comment');
    const form = await event.request.formData();
    const text = String(form.get('text') ?? '').trim();
    if (!text || text.length > 1000) {
      return fail(422, { commentError: 'Comment must be 1-1000 characters.' });
    }
    await postComment(event.fetch, movieId(event.params.id), text, token);
    return { commented: true };
  }
};
