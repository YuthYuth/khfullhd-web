import { describe, it, expect, vi } from 'vitest';
import { listMovies, getMovie, getRelated, getComments, postComment, searchMovies, listFavorites, listFavoriteIds, addFavorite, removeFavorite } from './api';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('listMovies', () => {
  it('builds the /movies query and returns the parsed body', async () => {
    const payload = { total: 1, limit: 24, offset: 0, items: [{ movie_id: 1, title: 'X' }] };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(payload));
    const result = await listMovies(fetch, { sort: 'rating_desc', limit: 24, offset: 0 });
    expect(result).toEqual(payload);
    const calledUrl = fetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/movies?');
    expect(calledUrl).toContain('sort=rating_desc');
    expect(calledUrl).toContain('limit=24');
    expect(calledUrl).toContain('offset=0');
  });
});

describe('getMovie', () => {
  it('returns the movie on 200', async () => {
    const movie = { movie_id: 5, title: 'Y' };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(movie));
    const result = await getMovie(fetch, 5);
    expect(result).toEqual(movie);
    expect(fetch.mock.calls[0][0]).toContain('/movies/5');
  });
  it('throws a 404 HttpError when the API returns 404', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ detail: 'movie not found' }, 404));
    await expect(getMovie(fetch, 999)).rejects.toMatchObject({ status: 404 });
  });
});

describe('searchMovies', () => {
  it('builds the /search query', async () => {
    const payload = { query: 'mulan', count: 1, items: [] };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(payload));
    const result = await searchMovies(fetch, 'mulan', 24);
    expect(result).toEqual(payload);
    expect(fetch.mock.calls[0][0]).toContain('/search?');
    expect(fetch.mock.calls[0][0]).toContain('q=mulan');
  });
  it('throws a 503 HttpError when search is unavailable', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ detail: 'search unavailable' }, 503));
    await expect(searchMovies(fetch, 'mulan')).rejects.toMatchObject({ status: 503 });
  });
});

describe('network failure', () => {
  it('maps a thrown fetch (API down) to a 503 HttpError', async () => {
    const fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(listMovies(fetch, {})).rejects.toMatchObject({ status: 503 });
  });
});

describe('optional auth token seam', () => {
  it('omits the Authorization header when no token is given', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ total: 0, limit: 24, offset: 0, items: [] }));
    await listMovies(fetch, {});
    expect(fetch.mock.calls[0][1]).toBeUndefined();
  });

  it('attaches a Bearer header when a token is given', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ total: 0, limit: 24, offset: 0, items: [] }));
    await listMovies(fetch, {}, 'tok123');
    expect(fetch.mock.calls[0][1]).toEqual({ headers: { Authorization: 'Bearer tok123' } });
  });
});

describe('favorites client', () => {
  it('listFavoriteIds GETs with a bearer token and returns the ids', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse([1, 2, 3]));
    const ids = await listFavoriteIds(fetch, 'tok');
    expect(ids).toEqual([1, 2, 3]);
    expect(fetch.mock.calls[0][0]).toContain('/favorites/ids');
    expect(fetch.mock.calls[0][1]).toMatchObject({ headers: { Authorization: 'Bearer tok' } });
  });

  it('addFavorite POSTs to /favorites/{id} with a bearer token', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ favorited: true }));
    await addFavorite(fetch, 7, 'tok');
    expect(fetch.mock.calls[0][0]).toContain('/favorites/7');
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', headers: { Authorization: 'Bearer tok' } });
  });

  it('removeFavorite DELETEs /favorites/{id} with a bearer token', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    await removeFavorite(fetch, 7, 'tok');
    expect(fetch.mock.calls[0][0]).toContain('/favorites/7');
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'DELETE', headers: { Authorization: 'Bearer tok' } });
  });
});

describe('getRelated', () => {
  it('builds the /movies/{id}/related query and returns the items', async () => {
    const payload = { items: [{ movie_id: 7, title: 'Z' }] };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(payload));
    const result = await getRelated(fetch, 5, 12);
    expect(result).toEqual(payload);
    const calledUrl = fetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/movies/5/related');
    expect(calledUrl).toContain('limit=12');
  });
});

describe('comments client', () => {
  it('getComments builds the URL and returns items', async () => {
    const payload = { items: [{ id: 1, movie_id: 5, author_name: 'Yuth', text: 'nice', created_at: '2026-06-10' }] };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(payload));
    const result = await getComments(fetch, 5);
    expect(result).toEqual(payload);
    expect(fetch.mock.calls[0][0]).toContain('/movies/5/comments');
  });

  it('postComment sends JSON body with bearer token', async () => {
    const created = { id: 2, movie_id: 5, author_name: 'Yuth', text: 'hello', created_at: '2026-06-10' };
    const fetch = vi.fn().mockResolvedValue(jsonResponse(created, 201));
    const result = await postComment(fetch, 5, 'hello', 'tok-123');
    expect(result).toEqual(created);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toContain('/movies/5/comments');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer tok-123');
    expect(JSON.parse(init.body)).toEqual({ text: 'hello' });
  });

  it('postComment maps 401 to a sign-in error', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ detail: 'missing bearer token' }, 401));
    await expect(postComment(fetch, 5, 'x', 'bad')).rejects.toMatchObject({ status: 401 });
  });
});
