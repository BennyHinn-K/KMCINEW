/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContentManager from './ContentManager';

vi.mock('../../lib/api', () => ({
  api: {
    adminGetItems: vi.fn(async () => ({ status: 200, data: [
      { id: '1', title: 'Event A', date: '2024-01-01', description: 'Desc', category: 'event' },
      { id: '2', title: 'Event B', date: '2024-01-02', description: 'Desc', category: 'event' },
    ] })),
    adminDeleteItem: vi.fn(async () => ({ status: 200, data: null })),
    adminUpdateItem: vi.fn(async () => ({ status: 200, data: null })),
    adminCreateItem: vi.fn(async () => ({ status: 200, data: { id: '3', title: 'New', date: '2024-01-03', description: 'New', category: 'event' } })),
  }
}));

describe('ContentManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onNotify = vi.fn();

  it('loads and displays items', async () => {
    render(<ContentManager category="event" title="Events" onNotify={onNotify} searchDebounce={0} />);
    await waitFor(() => {
      expect(screen.queryByText('Event A')).toBeTruthy();
      expect(screen.queryByText('Event B')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it.skip('filters items via search', async () => {
    render(<ContentManager category="event" title="Events" onNotify={onNotify} searchDebounce={0} />);
    await waitFor(() => expect(screen.queryByText('Event A')).toBeTruthy(), { timeout: 2000 });
    const input = screen.getAllByPlaceholderText('Search...')[0];
    fireEvent.change(input, { target: { value: 'B' } });
    await screen.findByText('Event B');
    expect(screen.queryByText('Event A')).toBeNull();
  });

  it('handles delete operation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true as unknown as boolean);
    render(<ContentManager category="event" title="Events" onNotify={onNotify} searchDebounce={0} />);
    await screen.findByText('Event A');
    const delBtn = screen.getAllByLabelText('Delete Item')[0];
    fireEvent.click(delBtn);
    await waitFor(() => {
      expect(onNotify).toHaveBeenCalled();
    });
  });
});
