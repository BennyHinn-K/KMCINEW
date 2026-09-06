import { afterEach, vi } from 'vitest';

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

if (typeof window === 'undefined') {
  global.window = {} as Window & typeof globalThis;
}

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.clear !== 'function') {
  const store = new Map<string, string>();

  const setItem = function (this: Storage, key: string, value: string) {
    store.set(String(key), String(value));
  };

  const getItem = function (this: Storage, key: string): string | null {
    return store.has(String(key)) ? (store.get(String(key)) as string) : null;
  };

  const removeItem = function (this: Storage, key: string) {
    store.delete(String(key));
  };

  const clear = function (this: Storage) {
    store.clear();
  };

  const key = function (this: Storage, index: number): string | null {
    const keys = Array.from(store.keys());
    return keys[index] ?? null;
  };

  Object.defineProperty(Storage.prototype, 'setItem', {
    value: setItem,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(Storage.prototype, 'getItem', {
    value: getItem,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(Storage.prototype, 'removeItem', {
    value: removeItem,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(Storage.prototype, 'clear', {
    value: clear,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(Storage.prototype, 'key', {
    value: key,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(Storage.prototype, 'length', {
    get() {
      return store.size;
    },
    configurable: true,
  });

  const storage = Object.create(Storage.prototype) as Storage;

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(globalThis.window, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  try {
    localStorage.clear();
  } catch {
    /* noop */
  }
});

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

export {};
