import { describe, it, expect, vi } from 'vitest';

vi.mock('$lib/server/session', () => ({ getAccessToken: vi.fn() }));
import { getAccessToken } from '$lib/server/session';
import { load } from '../../../routes/favorites/+page.server';

describe('favorites load', () => {
  it('redirects to / when signed out', async () => {
    (getAccessToken as any).mockResolvedValue(undefined);
    const event = { fetch: vi.fn() } as any;
    await expect(load(event)).rejects.toMatchObject({ status: 303, location: '/' });
  });

  it('returns the user movies when signed in', async () => {
    (getAccessToken as any).mockResolvedValue('tok');
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ items: [{ movie_id: 1, title: 'X' }] }), { status: 200 }));
    const event = { fetch } as any;
    const result: any = await load(event);
    expect(result.movies).toHaveLength(1);
    expect(fetch.mock.calls[0][1]).toMatchObject({ headers: { Authorization: 'Bearer tok' } });
  });
});
