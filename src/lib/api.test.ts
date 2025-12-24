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
});
