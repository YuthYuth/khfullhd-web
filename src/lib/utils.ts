export function parseGenres(genres: string | null): string[] {
  if (!genres) return [];
  return genres
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);
}

const TMDB_SIZE_RE = /\/t\/p\/[^/]+\//;

export function posterUrl(url: string | null, size = 'w342'): string | null {
  if (!url) return null;
  return url.replace(TMDB_SIZE_RE, `/t/p/${size}/`);
}

export function pageCount(total: number, limit: number): number {
  if (limit <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}

export function offsetFor(page: number, limit: number): number {
  return Math.max(0, (page - 1) * limit);
}

export function clampPage(page: number, total: number, limit: number): number {
  const pages = pageCount(total, limit);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), pages);
}
