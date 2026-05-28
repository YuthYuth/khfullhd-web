import { describe, it, expect } from 'vitest';
import { parseGenres, posterUrl, pageCount, offsetFor } from './utils';

describe('parseGenres', () => {
  it('splits a comma string and trims', () => {
    expect(parseGenres('Asian-Series, Drama, TV Series')).toEqual(['Asian-Series', 'Drama', 'TV Series']);
  });
  it('returns [] for null or empty', () => {
    expect(parseGenres(null)).toEqual([]);
    expect(parseGenres('')).toEqual([]);
  });
  it('drops empty segments', () => {
    expect(parseGenres('Drama, , ,Comedy')).toEqual(['Drama', 'Comedy']);
  });
});

describe('posterUrl', () => {
  it('rewrites the TMDB size segment to w342 by default', () => {
    expect(posterUrl('https://image.tmdb.org/t/p/original/abc.jpg')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg');
  });
  it('accepts a custom size', () => {
    expect(posterUrl('https://image.tmdb.org/t/p/w342/abc.jpg', 'w500')).toBe('https://image.tmdb.org/t/p/w500/abc.jpg');
  });
  it('returns null for null', () => {
    expect(posterUrl(null)).toBeNull();
  });
});

describe('pagination math', () => {
  it('pageCount rounds up and floors at 1', () => {
    expect(pageCount(0, 24)).toBe(1);
    expect(pageCount(24, 24)).toBe(1);
    expect(pageCount(25, 24)).toBe(2);
    expect(pageCount(100, 24)).toBe(5);
  });
  it('offsetFor is (page-1)*limit, never negative', () => {
    expect(offsetFor(1, 24)).toBe(0);
    expect(offsetFor(3, 24)).toBe(48);
    expect(offsetFor(0, 24)).toBe(0);
  });
});
