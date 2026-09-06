const TOKEN_KEY = 'kmci_admin_token';
const SESSION_KEY = 'kmci_admin_session';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminSession(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, 'true');
}

export function clearAdminSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function hasAdminSession(): boolean {
  const token = getAdminToken();
  if (!token || localStorage.getItem(SESSION_KEY) !== 'true') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
