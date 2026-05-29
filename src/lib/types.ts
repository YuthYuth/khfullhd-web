export interface Movie {
  movie_id: number;
  title: string | null;
  url: string | null;
  poster_url: string | null;
  release_year: number | null;
  imdb_rating: string | null;
  extra_info: string | null;
  genres: string | null;
  description: string | null;
  scraped_at: string | null;
}

export interface MovieList {
  total: number;
  limit: number;
  offset: number;
  items: Movie[];
}

export interface SearchResult {
  query: string;
  count: number;
  items: Movie[];
}

export type SortKey = 'release_year_desc' | 'release_year_asc' | 'rating_desc' | 'title_asc';

export const SORT_KEYS: SortKey[] = ['release_year_desc', 'release_year_asc', 'rating_desc', 'title_asc'];

export interface FavoritesOut {
  items: Movie[];
}
