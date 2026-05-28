import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Movie, MovieList, SearchResult, SortKey } from '$lib/types';

export type Fetcher = typeof globalThis.fetch;

function apiBase(): string {
  return env.KHFULLHD_API_URL || 'http://127.0.0.1:8000';
}

async function getJson<T>(fetch: Fetcher, path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiBase() + path);
  } catch {
    throw error(503, 'Catalog temporarily unavailable');
  }
  if (!res.ok) {
    if (res.status === 404) throw error(404, 'Not found');
    if (res.status === 503) throw error(503, 'Service temporarily unavailable');
    throw error(502, 'Unexpected response from the catalog API');
  }
  return (await res.json()) as T;
}

export interface ListParams {
  limit?: number;
  offset?: number;
  sort?: SortKey;
}

export function listMovies(fetch: Fetcher, params: ListParams): Promise<MovieList> {
  const qs = new URLSearchParams({
    limit: String(params.limit ?? 24),
    offset: String(params.offset ?? 0),
    sort: params.sort ?? 'release_year_desc'
  });
  return getJson<MovieList>(fetch, `/movies?${qs}`);
}

export function getMovie(fetch: Fetcher, id: number): Promise<Movie> {
  return getJson<Movie>(fetch, `/movies/${id}`);
}

export function searchMovies(fetch: Fetcher, q: string, limit = 24): Promise<SearchResult> {
  const qs = new URLSearchParams({ q, limit: String(limit) });
  return getJson<SearchResult>(fetch, `/search?${qs}`);
}
