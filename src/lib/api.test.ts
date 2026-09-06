/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';
import type { ContentItem } from '../types';

const sermons = [
  {
    id: '1',
    title: 'Walking in Divine Authority',
    speaker: 'Apostle John Doe',
    date: '2024-08-12',
    duration: '45 min',
    thumbnail: 'https://example.com/t.jpg',
    category: 'sermon',
    description: 'An empowering message on understanding and walking in the authority given to believers.',
  },
];

const events = [
  {
    id: '1',
    title: 'Annual Kingdom Conference',
    date: '2024-08-15',
    location: 'Nairobi Main Hall',
    description: 'Join us for three days of powerful worship.',
    category: 'event',
  },
];

describe('API Data Integrity', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes('category=sermon') && (!init?.method || init.method === 'GET')) {
          return new Response(JSON.stringify({ data: sermons }), { status: 200 });
        }
        if (url.includes('category=event') && (!init?.method || init.method === 'GET')) {
          return new Response(JSON.stringify({ data: events }), { status: 200 });
        }
        if (init?.method === 'POST') {
          return new Response(
            JSON.stringify({ error: { code: 'VALIDATION', message: 'Invalid payload' } }),
            { status: 400 }
          );
        }
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Missing' } }), { status: 404 });
      })
    );
  });

  it('should ensure all sermons have a description', async () => {
    const list = await api.getSermons();
    list.forEach((sermon) => {
      expect(sermon.description).toBeDefined();
      expect(sermon.description.length).toBeGreaterThan(0);
    });
  });

  it('should ensure all events have a description', async () => {
    const list = await api.getEvents();
    list.forEach((event) => {
      expect(event.description).toBeDefined();
      expect(event.description.length).toBeGreaterThan(0);
    });
  });

  it('should reject invalid sermon creation', async () => {
    const invalidSermon = {
      title: 'Invalid Sermon',
      description: 'Missing speaker',
      category: 'sermon' as const,
    };
    await expect(api.createItem('sermon', invalidSermon as unknown as ContentItem)).rejects.toThrow();
  });

  it('should reject invalid event creation', async () => {
    const invalidEvent = {
      title: 'Invalid Event',
      description: 'Missing date',
      category: 'event' as const,
    };
    await expect(api.createItem('event', invalidEvent as unknown as ContentItem)).rejects.toThrow();
  });
});
