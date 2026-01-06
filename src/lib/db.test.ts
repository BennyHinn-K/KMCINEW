/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Database } from './db';
import { StorageManager } from './storage';

describe('Database', () => {
  const db = new Database();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('persists valid sermon', async () => {
    const res = await db.createItem('sermon', {
      title: 'Test Sermon',
      description: 'Desc',
      date: '2024-01-01',
      speaker: 'Speaker',
      videoUrl: 'https://example.com'
    });
    expect(res.ok).toBe(true);
    const items = await db.getItems('sermon');
    expect(items.find(i => i.id === res.data?.id)?.title).toBe('Test Sermon');
  });

  it('rejects invalid sermon', async () => {
    const res = await db.createItem('sermon', {
      title: 'Bad',
      description: 'Desc',
      date: '2024-01-01'
    });
    expect(res.ok).toBe(false);
  });

  it('persists valid event with transaction', async () => {
    const res = await db.createItemsTransaction('event', [
      { title: 'E1', description: 'D', date: '2024-01-01', time: '10:00', location: 'Hall' },
      { title: 'E2', description: 'D', date: '2024-01-02', time: '10:00', location: 'Hall' }
    ]);
    expect(res.ok).toBe(true);
    expect(res.data?.count).toBe(2);
    const items = await db.getItems('event');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it('handles update and delete', async () => {
    const created = await db.createItem('announcement', {
      title: 'News A', description: 'D', date: '2024-01-03'
    });
    expect(created.ok).toBe(true);
    const id = created.data!.id;
    const up = await db.updateItem('announcement', id, { featured: true });
    expect(up.ok).toBe(true);
    const del = await db.deleteItem('announcement', id);
    expect(del.ok).toBe(true);
  });

  it('retries transient storage failures', async () => {
    const spy = vi.spyOn(StorageManager, 'setItem');
    let calls = 0;
    spy.mockImplementation((key) => {
      calls++;
      if (calls < 2 && key === 'kmci_sermons') {
        const err = new Error('Temporary');
        err.name = 'AbortError';
        throw err;
      }
      return true;
    });
    const res = await db.createItem('sermon', {
      title: 'Retry Sermon', description: 'D', date: '2024-01-04', speaker: 'S', videoUrl: 'u'
    });
    expect(res.ok).toBe(true);
  });

  it('high load insert', async () => {
    const payload = Array.from({ length: 200 }, (_, i) => ({
      title: `Bulk ${i}`, description: 'D', date: '2024-02-01', time: '10:00', location: 'Hall'
    }));
    const res = await db.createItemsTransaction('event', payload);
    expect(res.ok).toBe(true);
    const items = await db.getItems('event');
    expect(items.length).toBeGreaterThanOrEqual(200);
  });
});
