import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Movie, MovieList, SearchResult, SortKey, FavoritesOut, RelatedOut } from '$lib/types';

export type Fetcher = typeof globalThis.fetch;

function apiBase(): string {
  return env.KHFULLHD_API_URL || 'http://127.0.0.1:8000';
}

async function getJson<T>(fetch: Fetcher, path: string, token?: string): Promise<T> {
  const init = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  let res: Response;
  try {
    res = await fetch(apiBase() + path, init);
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

export function listMovies(fetch: Fetcher, params: ListParams, token?: string): Promise<MovieList> {
  const qs = new URLSearchParams({
    limit: String(params.limit ?? 24),
    offset: String(params.offset ?? 0),
    sort: params.sort ?? 'release_year_desc'
  });
  return getJson<MovieList>(fetch, `/movies?${qs}`, token);
}

export function getMovie(fetch: Fetcher, id: number, token?: string): Promise<Movie> {
  return getJson<Movie>(fetch, `/movies/${id}`, token);
}

export function getRelated(fetch: Fetcher, id: number, limit = 12, token?: string): Promise<RelatedOut> {
  const qs = new URLSearchParams({ limit: String(limit) });
  return getJson<RelatedOut>(fetch, `/movies/${id}/related?${qs}`, token);
}

export function searchMovies(fetch: Fetcher, q: string, limit = 24, token?: string): Promise<SearchResult> {
  const qs = new URLSearchParams({ q, limit: String(limit) });
  return getJson<SearchResult>(fetch, `/search?${qs}`, token);
}

async function send(fetch: Fetcher, path: string, method: 'POST' | 'DELETE', token: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(apiBase() + path, { method, headers: { Authorization: `Bearer ${token}` } });
  } catch {
    throw error(503, 'Catalog temporarily unavailable');
  }
  if (!res.ok) {
    if (res.status === 404) throw error(404, 'Not found');
    if (res.status === 401) throw error(401, 'Sign in required');
    throw error(502, 'Unexpected response from the catalog API');
  }
}

export function listFavorites(fetch: Fetcher, token: string): Promise<FavoritesOut> {
  return getJson<FavoritesOut>(fetch, '/favorites', token);
}

export function listFavoriteIds(fetch: Fetcher, token: string): Promise<number[]> {
  return getJson<number[]>(fetch, '/favorites/ids', token);
}

export function addFavorite(fetch: Fetcher, id: number, token: string): Promise<void> {
  return send(fetch, `/favorites/${id}`, 'POST', token);
}

export function removeFavorite(fetch: Fetcher, id: number, token: string): Promise<void> {
  return send(fetch, `/favorites/${id}`, 'DELETE', token);
}
