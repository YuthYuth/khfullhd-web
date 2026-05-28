import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../routes/search/+page.server';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}
function event(search: string, fetch: ReturnType<typeof vi.fn>) {
  return { fetch, url: new URL(`http://localhost/search${search}`), params: {} } as any;
}

// Test-only alias to satisfy svelte-check's return-union narrowing
type LoadResult = {
  q: string;
  tooShort: boolean;
  unavailable: boolean;
  count: number;
  movies: unknown[];
};

describe('search load', () => {
  it('flags a query shorter than 2 chars and does not call the API', async () => {
    const fetch = vi.fn();
    const result = (await load(event('?q=a', fetch))) as LoadResult;
    expect(result.tooShort).toBe(true);
    expect(result.movies).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns results for a valid query', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ query: 'mulan', count: 1, items: [{ movie_id: 1 }] }));
    const result = (await load(event('?q=mulan', fetch))) as LoadResult;
    expect(result.count).toBe(1);
    expect(result.movies).toHaveLength(1);
  });

  it('returns unavailable=true when search responds 503', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ detail: 'search unavailable' }, 503));
    const result = (await load(event('?q=mulan', fetch))) as LoadResult;
    expect(result.unavailable).toBe(true);
    expect(result.movies).toEqual([]);
  });
});
