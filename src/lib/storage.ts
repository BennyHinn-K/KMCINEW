import { Logger } from './logger';

/**
 * StorageManager: A robust local storage wrapper with error handling,
 * namespacing, and fallback mechanisms.
 */

const NAMESPACE = 'kmci_app_v1_';

export interface StorageResult<T> {
  data: T | null;
  error?: Error;
}

export class StorageManager {
  private static isSupported(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private static getNamespacedKey(key: string): string {
    return `${NAMESPACE}${key}`;
  }

  private static handleError(error: unknown, operation: string, key?: string): Error {
    let finalError: Error;
    if (error instanceof Error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
             finalError = new Error('Storage quota exceeded. Please clear some space.');
        } else if (error.name === 'SecurityError') {
             finalError = new Error('Storage disabled due to security settings.');
        } else {
             finalError = error;
        }
    } else {
        finalError = new Error('Unknown storage error');
    }
    
    Logger.error(`Storage Error [${operation}]`, { key, error: finalError.message });
    return finalError;
  }

  /**
   * Safe storage retrieval
   */
  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isSupported()) {
        Logger.warn('LocalStorage not supported, returning default value');
        return defaultValue;
    }

    try {
      const fullKey = this.getNamespacedKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (item === null) return defaultValue;

      try {
        return JSON.parse(item) as T;
      } catch {
        // If parsing fails, it might be a simple string or corrupted
        Logger.error(`Failed to parse item for key: ${key}`);
        return defaultValue;
      }
    } catch (error) {
      this.handleError(error, 'getItem', key);
      return defaultValue;
    }
  }

  /**
   * Safe storage saving with quota handling
   */
  static setItem<T>(key: string, value: T): boolean {
    if (!this.isSupported()) return false;

    try {
      const fullKey = this.getNamespacedKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      this.handleError(error, 'setItem', key);
      return false;
    }
  }

  /**
   * Remove item
   */
  static removeItem(key: string): boolean {
    if (!this.isSupported()) return false;

    try {
      const fullKey = this.getNamespacedKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
       this.handleError(error, 'removeItem', key);
       return false;
    }
  }

  /**
   * Clear all app-specific keys
   */
  static clear(): void {
    if (!this.isSupported()) return;

    try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(NAMESPACE)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        this.handleError(error, 'clear');
    }
  }
}

// Fallback in-memory storage for environments where localStorage is unavailable
export class InMemoryStorage {
  private static storage = new Map<string, unknown>();

  static getItem<T>(key: string, defaultValue: T): T {
    return this.storage.has(key) ? (this.storage.get(key) as T) : defaultValue;
  }

  static setItem<T>(key: string, value: T): boolean {
    this.storage.set(key, value);
    return true;
  }
  
  static removeItem(key: string): boolean {
      return this.storage.delete(key);
  }
}
