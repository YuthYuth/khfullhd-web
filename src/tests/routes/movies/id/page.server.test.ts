import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../routes/movies/[id]/+page.server';
import type { Movie } from '$lib/types';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}
function event(id: string, fetch: ReturnType<typeof vi.fn>) {
  return { fetch, url: new URL(`http://localhost/movies/${id}`), params: { id } } as any;
}

type LoadResult = { movie: Movie };

describe('detail load', () => {
  it('throws 404 for a non-numeric id without calling the API', async () => {
    const fetch = vi.fn();
    await expect(load(event('abc', fetch))).rejects.toMatchObject({ status: 404 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns the movie for a valid id', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ movie_id: 7, title: 'Z' }));
    const result = (await load(event('7', fetch))) as LoadResult;
    expect(result.movie.movie_id).toBe(7);
  });

  it('propagates a 404 from the API', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ detail: 'movie not found' }, 404));
    await expect(load(event('999999', fetch))).rejects.toMatchObject({ status: 404 });
  });
});
