/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { api } from './api';

describe('API Data Integrity', () => {
  it('should ensure all sermons have a description', async () => {
    const sermons = await api.getSermons();
    sermons.forEach(sermon => {
      expect(sermon.description).toBeDefined();
      expect(sermon.description.length).toBeGreaterThan(0);
    });
  });

  it('should ensure all events have a description', async () => {
    const events = await api.getEvents();
    events.forEach(event => {
      expect(event.description).toBeDefined();
      expect(event.description.length).toBeGreaterThan(0);
    });
  });

  it('should reject invalid sermon creation', async () => {
    const invalidSermon = {
      title: 'Invalid Sermon',
      description: 'Missing speaker',
      category: 'sermon' as const,
      // Missing speaker and videoUrl
    };
    await expect(api.createItem('sermon', invalidSermon as any)).rejects.toThrow();
  });

  it('should reject invalid event creation', async () => {
    const invalidEvent = {
      title: 'Invalid Event',
      description: 'Missing date',
      category: 'event' as const,
      // Missing date and location
    };
    await expect(api.createItem('event', invalidEvent as any)).rejects.toThrow();
  });
});
