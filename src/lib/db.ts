import { Logger } from './logger';
import { ContentCategory, ContentItem, ISermon, IEvent, INewsItem } from '../types';
import { StorageManager } from './storage';

type DbItem = ContentItem & { id: string };

interface OperationResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}

const STORAGE_KEYS = {
  EVENTS: 'kmci_events',
  SERMONS: 'kmci_sermons',
  NEWS: 'kmci_news'
};

const BACKOFFS = [100, 250, 500, 1000];

function toISODate(input: string | Date): string {
  if (input instanceof Date) return input.toISOString().slice(0, 10);
  return new Date(input).toISOString().slice(0, 10);
}

function validateEvent(data: Partial<IEvent>): OperationResult {
  if (!data.title || !String(data.title).trim()) return { ok: false, error: { code: 'TITLE_REQUIRED', message: 'Title is required' } };
  if (!data.date) return { ok: false, error: { code: 'DATE_REQUIRED', message: 'Date is required' } };
  if (!data.description || !String(data.description).trim()) return { ok: false, error: { code: 'DESCRIPTION_REQUIRED', message: 'Description is required' } };
  if (!data.time || !String(data.time).trim()) return { ok: false, error: { code: 'TIME_REQUIRED', message: 'Time is required for events' } };
  if (!data.location || !String(data.location).trim()) return { ok: false, error: { code: 'LOCATION_REQUIRED', message: 'Location is required for events' } };
  return { ok: true };
}

function validateSermon(data: Partial<ISermon>): OperationResult {
  if (!data.title || !String(data.title).trim()) return { ok: false, error: { code: 'TITLE_REQUIRED', message: 'Title is required' } };
  if (!data.date) return { ok: false, error: { code: 'DATE_REQUIRED', message: 'Date is required' } };
  if (!data.description || !String(data.description).trim()) return { ok: false, error: { code: 'DESCRIPTION_REQUIRED', message: 'Description is required' } };
  if (!data.speaker || !String(data.speaker).trim()) return { ok: false, error: { code: 'SPEAKER_REQUIRED', message: 'Speaker is required for sermons' } };
  return { ok: true };
}

function validateNews(data: Partial<INewsItem>): OperationResult {
  if (!data.title || !String(data.title).trim()) return { ok: false, error: { code: 'TITLE_REQUIRED', message: 'Title is required' } };
  if (!data.date) return { ok: false, error: { code: 'DATE_REQUIRED', message: 'Date is required' } };
  if (!data.description || !String(data.description).trim()) return { ok: false, error: { code: 'DESCRIPTION_REQUIRED', message: 'Description is required' } };
  return { ok: true };
}

function normalizeItem(category: ContentCategory, data: Partial<ContentItem>): Omit<ContentItem, 'id'> {
  const baseCommon = {
    title: String(data.title || '').trim(),
    date: toISODate(data.date || new Date()),
    description: String(data.description || '').trim(),
    category,
    featured: Boolean(data.featured)
  };
  if (category === 'event') {
    const ev = data as Partial<IEvent>;
    return {
      ...baseCommon,
      imageUrl: ev.imageUrl || '',
      time: String(ev.time || '').trim(),
      location: String(ev.location || '').trim()
    } as Omit<IEvent, 'id'>;
  }
  if (category === 'sermon') {
    const se = data as Partial<ISermon>;
    return {
      ...baseCommon,
      speaker: String(se.speaker || '').trim(),
      duration: String(se.duration || '').trim(),
      thumbnail: String(se.thumbnail || ''),
      videoUrl: String(se.videoUrl || '')
    } as Omit<ISermon, 'id'>;
  }
  const nw = data as Partial<INewsItem>;
  return {
    ...baseCommon,
    imageUrl: nw.imageUrl || ''
  } as Omit<INewsItem, 'id'>;
}

function validatorFor(category: ContentCategory) {
  return (data: Partial<ContentItem>) => {
    if (category === 'event') return validateEvent(data as Partial<IEvent>);
    if (category === 'sermon') return validateSermon(data as Partial<ISermon>);
    return validateNews(data as Partial<INewsItem>);
  };
}

export class Database {
  private db: IDBDatabase | null = null;
  private ready = false;

  async connect(): Promise<void> {
    if (this.ready) return;
    if (typeof indexedDB === 'undefined') {
      Logger.warn('IndexedDB unavailable, using localStorage fallback');
      this.ready = true;
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('kmci_db', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('sermons')) db.createObjectStore('sermons', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('news')) db.createObjectStore('news', { keyPath: 'id' });
      };
      request.onsuccess = () => {
        this.db = request.result;
        this.ready = true;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  close(): void {
    if (this.db) this.db.close();
    this.db = null;
    this.ready = false;
  }

  private storeName(category: ContentCategory): string {
    if (category === 'event') return 'events';
    if (category === 'sermon') return 'sermons';
    return 'news';
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < BACKOFFS.length; i++) {
      try {
        return await fn();
      } catch (e) {
        lastError = e;
        await new Promise(r => setTimeout(r, BACKOFFS[i]));
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Unknown storage error');
  }

  async getItems(category: ContentCategory): Promise<DbItem[]> {
    await this.connect();
    if (!this.db) {
      const key = category === 'event' ? STORAGE_KEYS.EVENTS : category === 'sermon' ? STORAGE_KEYS.SERMONS : STORAGE_KEYS.NEWS;
      const defaults: DbItem[] = StorageManager.getItem<DbItem[]>(key, []);
      return defaults;
    }
    return this.withRetry(async () => {
      return await new Promise<DbItem[]>((resolve, reject) => {
        const tx = this.db!.transaction(this.storeName(category), 'readonly');
        const store = tx.objectStore(this.storeName(category));
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as DbItem[]);
        req.onerror = () => reject(req.error);
      });
    });
  }

  async createItem(category: ContentCategory, data: Partial<ContentItem>): Promise<OperationResult<{ id: string }>> {
    await this.connect();
    const validate = validatorFor(category);
    const v = validate(data);
    if (!v.ok) return { ok: false, error: v.error };
    const item = normalizeItem(category, data);
    const id = crypto.randomUUID();
    const newItem = { id, ...item } as DbItem;
    Logger.access('DB create', { category, id });
    if (!this.db) {
      const key = category === 'event' ? STORAGE_KEYS.EVENTS : category === 'sermon' ? STORAGE_KEYS.SERMONS : STORAGE_KEYS.NEWS;
      const items = StorageManager.getItem<DbItem[]>(key, []);
      const success = await this.withRetry(async () => StorageManager.setItem(key, [newItem, ...items]));
      return success ? { ok: true, data: { id } } : { ok: false, error: { code: 'SET_FAILED', message: 'Failed to persist item' } };
    }
    try {
      await this.withRetry(async () => {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(this.storeName(category), 'readwrite');
          const store = tx.objectStore(this.storeName(category));
          const req = store.add(newItem);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
      return { ok: true, data: { id } };
    } catch (e) {
      Logger.error('DB create error', { category, error: e });
      return { ok: false, error: { code: 'CREATE_FAILED', message: 'Failed to create item' } };
    }
  }

  async updateItem(category: ContentCategory, id: string, updates: Partial<ContentItem>): Promise<OperationResult> {
    await this.connect();
    const existing = await this.getItems(category);
    const current = existing.find(i => i.id === id);
    if (!current) return { ok: false, error: { code: 'NOT_FOUND', message: 'Item not found' } };
    const merged = { ...current, ...normalizeItem(category, { ...current, ...updates }) } as DbItem;
    Logger.access('DB update', { category, id });
    if (!this.db) {
      const key = category === 'event' ? STORAGE_KEYS.EVENTS : category === 'sermon' ? STORAGE_KEYS.SERMONS : STORAGE_KEYS.NEWS;
      const items = existing.map(i => i.id === id ? merged : i);
      const success = await this.withRetry(async () => StorageManager.setItem(key, items));
      return success ? { ok: true } : { ok: false, error: { code: 'SET_FAILED', message: 'Failed to persist update' } };
    }
    try {
      await this.withRetry(async () => {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(this.storeName(category), 'readwrite');
          const store = tx.objectStore(this.storeName(category));
          const req = store.put(merged);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
      return { ok: true };
    } catch (e) {
      Logger.error('DB update error', { category, id, error: e });
      return { ok: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update item' } };
    }
  }

  async deleteItem(category: ContentCategory, id: string): Promise<OperationResult> {
    await this.connect();
    Logger.access('DB delete', { category, id });
    if (!this.db) {
      const key = category === 'event' ? STORAGE_KEYS.EVENTS : category === 'sermon' ? STORAGE_KEYS.SERMONS : STORAGE_KEYS.NEWS;
      const items = StorageManager.getItem<DbItem[]>(key, []);
      const success = await this.withRetry(async () => StorageManager.setItem(key, items.filter(i => i.id !== id)));
      return success ? { ok: true } : { ok: false, error: { code: 'SET_FAILED', message: 'Failed to persist delete' } };
    }
    try {
      await this.withRetry(async () => {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(this.storeName(category), 'readwrite');
          const store = tx.objectStore(this.storeName(category));
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
      return { ok: true };
    } catch (e) {
      Logger.error('DB delete error', { category, id, error: e });
      return { ok: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete item' } };
    }
  }

  async createItemsTransaction(category: ContentCategory, items: Array<Partial<ContentItem>>): Promise<OperationResult<{ count: number }>> {
    await this.connect();
    const validate = validatorFor(category);
    for (const it of items) {
      const v = validate(it);
      if (!v.ok) return { ok: false, error: v.error };
    }
    if (!this.db) {
      const key = category === 'event' ? STORAGE_KEYS.EVENTS : category === 'sermon' ? STORAGE_KEYS.SERMONS : STORAGE_KEYS.NEWS;
      const existing = StorageManager.getItem<DbItem[]>(key, []);
      const toAdd = items.map(it => ({ id: crypto.randomUUID(), ...normalizeItem(category, it) } as DbItem));
      const success = await this.withRetry(async () => StorageManager.setItem(key, [...toAdd, ...existing]));
      return success ? { ok: true, data: { count: toAdd.length } } : { ok: false, error: { code: 'SET_FAILED', message: 'Failed to persist transaction' } };
    }
    try {
      await this.withRetry(async () => {
        await new Promise<void>((resolve, reject) => {
          const tx = this.db!.transaction(this.storeName(category), 'readwrite');
          const store = tx.objectStore(this.storeName(category));
          let pending = items.length;
          for (const it of items) {
            const item = { id: crypto.randomUUID(), ...normalizeItem(category, it) } as DbItem;
            const req = store.add(item);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
              pending--;
              if (pending === 0) resolve();
            };
          }
        });
      });
      return { ok: true, data: { count: items.length } };
    } catch (e) {
      Logger.error('DB transaction error', { category, error: e });
      return { ok: false, error: { code: 'TRANSACTION_FAILED', message: 'Failed to commit transaction' } };
    }
  }
}
