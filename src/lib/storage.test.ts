/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager } from './storage';

describe('StorageManager', () => {
  const TEST_KEY = 'test_key';
  const NAMESPACED_KEY = 'kmci_app_v1_' + TEST_KEY;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should save and retrieve an item', () => {
    const data = { id: 1, name: 'Test' };
    StorageManager.setItem(TEST_KEY, data);
    
    const retrieved = StorageManager.getItem(TEST_KEY, null);
    expect(retrieved).toEqual(data);
  });

  it('should return default value if key does not exist', () => {
    const defaultValue = { id: 0 };
    const retrieved = StorageManager.getItem('non_existent', defaultValue);
    expect(retrieved).toEqual(defaultValue);
  });

  it('should handle quota exceeded error gracefully', () => {
    // Mock localStorage.setItem to throw error ONLY for the actual data, not the test key
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockImplementation((key) => {
      if (key === '__test__') return; // Allow test key
      
      const error = new Error('Quota exceeded');
      error.name = 'QuotaExceededError';
      throw error;
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const success = StorageManager.setItem(TEST_KEY, 'large_data');
    
    expect(success).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should namespace keys correctly', () => {
    StorageManager.setItem(TEST_KEY, 'value');
    expect(localStorage.getItem(NAMESPACED_KEY)).toBe(JSON.stringify('value'));
  });

  it('should clear only app-specific keys', () => {
    StorageManager.setItem(TEST_KEY, 'value');
    localStorage.setItem('other_key', 'other_value');

    StorageManager.clear();

    expect(localStorage.getItem(NAMESPACED_KEY)).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('other_value');
  });
});
