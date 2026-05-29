export interface SessionUser {
  name?: string | null;
  email?: string | null;
}

export function userLabel(user: SessionUser | null | undefined): string | null {
  if (!user) return null;
  return user.name || user.email || null;
}
