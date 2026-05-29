import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../routes/favorites/+page.server';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe('favorites load', () => {
  it('redirects to / when signed out', async () => {
    const event = { fetch: vi.fn(), locals: { auth: async () => null } } as any;
    await expect(load(event)).rejects.toMatchObject({ status: 303, location: '/' });
  });

  it('returns the user movies when signed in', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({ items: [{ movie_id: 1, title: 'X' }] }));
    const event = { fetch, locals: { auth: async () => ({ user: { name: 'A' }, accessToken: 'tok' }) } } as any;
    const result: any = await load(event);
    expect(result.movies).toHaveLength(1);
    expect(fetch.mock.calls[0][1]).toMatchObject({ headers: { Authorization: 'Bearer tok' } });
  });
});
