import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchMovies } from '$lib/server/api';

/** Typeahead suggestions: thin proxy over the ES-backed /search.
 *  Always answers 200 — a quiet dropdown beats a broken search box. */
export const GET: RequestHandler = async ({ url, fetch }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return json({ items: [] });
  try {
    const result = await searchMovies(fetch, q, 6);
    return json({
      items: result.items.map((m) => ({
        movie_id: m.movie_id,
        title: m.title,
        release_year: m.release_year
      }))
    });
  } catch {
    return json({ items: [] });
  }
};
