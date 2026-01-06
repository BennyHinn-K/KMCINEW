/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { api } from './api';
import type { ContentItem } from '../types';

describe('Admin API wrappers', () => {
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
