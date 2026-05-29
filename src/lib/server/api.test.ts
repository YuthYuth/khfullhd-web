import { describe, it, expect, vi } from 'vitest';
import { listMovies, getMovie, searchMovies } from './api';

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
