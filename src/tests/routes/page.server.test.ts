import { describe, it, expect, vi } from 'vitest';
import { load } from '../../routes/+page.server';

type LoadResult = { topRated: unknown[]; newest: unknown[]; suggested: unknown[] };

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200 });
}

describe('home load', () => {
  it('returns top-rated and newest rows', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ total: 1, limit: 18, offset: 0, items: [{ movie_id: 1 }] }))
      .mockResolvedValueOnce(jsonResponse({ total: 1, limit: 18, offset: 0, items: [{ movie_id: 2 }] }));
    const result = (await load({ fetch } as any)) as LoadResult;
    expect(result.topRated).toHaveLength(1);
    expect(result.newest).toHaveLength(1);
    const urls = fetch.mock.calls.map((c: any[]) => c[0] as string);
    expect(urls.some((u) => u.includes('sort=rating_desc'))).toBe(true);
    expect(urls.some((u) => u.includes('sort=release_year_desc'))).toBe(true);
  });

  it('anonymous visitors get an empty suggested row, not an error', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ total: 0, limit: 18, offset: 0, items: [] }))
      .mockResolvedValueOnce(jsonResponse({ total: 0, limit: 18, offset: 0, items: [] }));
    // bare event: no cookies/session -> getAccessToken fails -> anonymous
    const result = (await load({ fetch } as any)) as LoadResult;
    expect(result.suggested).toEqual([]);
  });
});
