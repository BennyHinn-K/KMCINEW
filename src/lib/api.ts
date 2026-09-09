import { Logger } from './logger';
import { IEvent, ISermon, INewsItem, ContentItem, ContentCategory } from '../types';
import { authHeaders, clearAdminSession } from './session';
 
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: ApiError;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(url: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init.headers || {}),
    };
    const res = await fetch(url, { ...init, headers });
    const json = (await res.json().catch(() => ({}))) as { data?: T; error?: ApiError; token?: string };
    if (res.status === 401) {
      clearAdminSession();
    }
    if (!res.ok) {
      return {
        status: res.status,
        error: json.error || { code: 'REQUEST_FAILED', message: 'Request failed' },
      };
    }
    return { status: res.status, data: json.data as T };
  } catch (error) {
    Logger.error('API request failed', { url, error });
    return { status: 500, error: { code: 'NETWORK', message: 'Unable to reach the server' } };
  }
}

function unwrapList<T>(res: ApiResponse<T[]>): Promise<T[]> {
  if (res.status === 200 && Array.isArray(res.data)) return Promise.resolve(res.data);
  throw new Error(res.error?.message || 'Failed to load content');
}

export const api = {
  getEvents: async (): Promise<IEvent[]> => {
    await delay(120);
    return unwrapList(await request<IEvent[]>('/api/content?category=event'));
  },

  getSermons: async (): Promise<ISermon[]> => {
    await delay(120);
    return unwrapList(await request<ISermon[]>('/api/content?category=sermon'));
  },

  getNews: async (): Promise<INewsItem[]> => {
    await delay(120);
    return unwrapList(await request<INewsItem[]>('/api/content?category=announcement'));
  },

  createItem: async (category: ContentCategory, item: Omit<ContentItem, 'id'>): Promise<void> => {
    const res = await api.adminCreateItem(category, item);
    if (res.status !== 200) throw new Error(res.error?.message || `Failed to create ${category}`);
  },

  updateItem: async (category: ContentCategory, id: string, updates: Partial<ContentItem>): Promise<void> => {
    const res = await api.adminUpdateItem(category, id, updates);
    if (res.status !== 200) throw new Error(res.error?.message || `Failed to update ${category}`);
  },

  deleteItem: async (category: ContentCategory, id: string): Promise<void> => {
    const res = await api.adminDeleteItem(category, id);
    if (res.status !== 200) throw new Error(res.error?.message || `Failed to delete ${category}`);
  },

  adminGetItems: async (category: ContentCategory): Promise<ApiResponse<ContentItem[]>> => {
    return request<ContentItem[]>(`/api/content?category=${category}`);
  },

  adminCreateItem: async (category: ContentCategory, item: Omit<ContentItem, 'id'>): Promise<ApiResponse<ContentItem>> => {
    return request<ContentItem>(`/api/content?category=${category}`, {
      method: 'POST',
      body: JSON.stringify({ ...item, category }),
    });
  },

  adminUpdateItem: async (
    category: ContentCategory,
    id: string,
    updates: Partial<ContentItem>
  ): Promise<ApiResponse<null>> => {
    return request<null>(`/api/content?category=${category}&id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  adminDeleteItem: async (category: ContentCategory, id: string): Promise<ApiResponse<null>> => {
    return request<null>(`/api/content?category=${category}&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  login: async (password: string): Promise<ApiResponse<{ token: string }>> => {
    const attemptMeta = {
      timestamp: new Date().toISOString(),
      passwordLength: password.length,
      origin: typeof window !== 'undefined' ? window.location.origin : null,
    };
    Logger.info('Auth: login attempt submitted', attemptMeta);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { token?: string; error?: ApiError };
      if (!res.ok || !json.token) {
        Logger.warn('Auth: login denied by server', { ...attemptMeta, status: res.status, errorCode: json.error?.code });
        return {
          status: res.status,
          error: json.error || { code: 'AUTH_FAILED', message: 'Invalid password' },
        };
      }
      Logger.access('Auth: login accepted by server', attemptMeta);
      return { status: 200, data: { token: json.token } };
    } catch (error) {
      Logger.error('Auth: login request failed', { ...attemptMeta, error });
      return { status: 500, error: { code: 'NETWORK', message: 'Unable to reach the server' } };
    }
  },

  changePassword: async (
    _currentPassword: string,
    _newPassword: string
  ): Promise<ApiResponse<{ ok: boolean; token?: string }>> => {
    Logger.warn('Auth: changePassword client method called but is disabled by policy');
    return {
      status: 403,
      error: {
        code: 'PASSWORD_CHANGE_DISABLED',
        message: 'Password changes are disabled. Only the fixed passkey "ADMIN@kmci" is accepted.',
      },
    };
  },

  exportBackup: async (): Promise<ApiResponse<{ events: IEvent[]; announcements: INewsItem[] }>> => {
    return request('/api/backup');
  },

  restoreBackup: async (payload: { events: IEvent[]; announcements: INewsItem[] }): Promise<ApiResponse<{ ok: boolean }>> => {
    return request('/api/backup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  sendContact: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }): Promise<ApiResponse<{ ok: boolean; delivered: boolean }>> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        delivered?: boolean;
        error?: ApiError;
      };
      if (!res.ok) {
        return {
          status: res.status,
          error: json.error || { code: 'CONTACT_FAILED', message: 'Unable to send message' },
        };
      }
      return { status: 200, data: { ok: true, delivered: Boolean(json.delivered) } };
    } catch (error) {
      Logger.error('Contact request failed', { error });
      return { status: 500, error: { code: 'NETWORK', message: 'Unable to reach the server' } };
    }
  },
};
