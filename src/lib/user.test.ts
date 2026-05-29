import { describe, it, expect } from 'vitest';
import { userLabel } from './user';

describe('userLabel', () => {
  it('returns null for no user', () => {
    expect(userLabel(null)).toBeNull();
    expect(userLabel(undefined)).toBeNull();
  });
  it('prefers name, falls back to email', () => {
    expect(userLabel({ name: 'Ada Lovelace', email: 'ada@x.io' })).toBe('Ada Lovelace');
    expect(userLabel({ email: 'ada@x.io' })).toBe('ada@x.io');
  });
  it('returns null when neither name nor email is present', () => {
    expect(userLabel({})).toBeNull();
  });
});
