import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../routes/movies/+page.server';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function event(search: string, fetch: ReturnType<typeof vi.fn>) {
  return { fetch, url: new URL(`http://localhost/movies${search}`), params: {} } as any;
}

type LoadResult = { page: number; sort: string; total: number; limit: number; movies: unknown[] };

describe('browse load', () => {
  it('defaults to page 1 and release_year_desc sort', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ total: 50, limit: 24, offset: 0, items: [] }));
    const result = (await load(event('', fetch))) as LoadResult;
    expect(result.page).toBe(1);
    expect(result.sort).toBe('release_year_desc');
    expect(result.total).toBe(50);
    expect(fetch.mock.calls[0][0]).toContain('offset=0');
  });

  it('rejects an unknown sort and falls back to the default', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ total: 0, limit: 24, offset: 0, items: [] }));
    const result = (await load(event('?sort=hacker', fetch))) as LoadResult;
    expect(result.sort).toBe('release_year_desc');
  });

  it('computes offset from the page param', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ total: 100, limit: 24, offset: 48, items: [] }));
    const result = (await load(event('?page=3', fetch))) as LoadResult;
    expect(result.page).toBe(3);
    expect(fetch.mock.calls[0][0]).toContain('offset=48');
  });
});
