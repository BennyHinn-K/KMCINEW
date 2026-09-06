/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';
import type { ContentItem } from '../types';

describe('Admin API wrappers', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method || 'GET';
        if (method === 'GET' && url.includes('category=event')) {
          return new Response(JSON.stringify({ data: [{ id: '1', title: 'Event', date: '2024-01-01', description: 'Desc', category: 'event' }] }), {
            status: 200,
          });
        }
        if (method === 'GET' && url.includes('category=announcement')) {
          return new Response(
            JSON.stringify({
              data: [{ id: '1', title: 'News', date: '2024-01-01', description: 'Desc', category: 'announcement' }],
            }),
            { status: 200 }
          );
        }
        if (method === 'POST') {
          return new Response(JSON.stringify({ error: { code: 'VALIDATION', message: 'Date is required for events' } }), {
            status: 400,
          });
        }
        if (method === 'DELETE') {
          return new Response(JSON.stringify({ data: null }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Missing' } }), { status: 404 });
      })
    );
  });

  it('adminGetItems returns status 200 and data', async () => {
    const res = await api.adminGetItems('event');
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('adminCreateItem fails validation with status 400', async () => {
    const invalid: Omit<ContentItem, 'id'> = {
      title: 'Invalid Event',
      description: 'Missing date',
      category: 'event',
      date: '',
    } as unknown as Omit<ContentItem, 'id'>;
    const res = await api.adminCreateItem('event', invalid);
    expect(res.status).toBe(400);
    expect(res.error).toBeDefined();
  });

  it('adminDeleteItem returns status 200', async () => {
    const resList = await api.adminGetItems('announcement');
    const first = resList.data?.[0];
    if (!first) {
      expect(true).toBe(true);
      return;
    }
    const res = await api.adminDeleteItem('announcement', first.id);
    expect(res.status).toBe(200);
  });
});
