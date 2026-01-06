import { Logger } from './logger';
import { IEvent, ISermon, INewsItem, ContentItem, ContentCategory } from '../types';
import { Database } from './db';
 
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: ApiError;
}

// Mock Data removed in favor of database-backed storage

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const db = new Database();

// Validation Helpers
const validateItem = (item: unknown, category: ContentCategory) => {
  const data = item as Record<string, unknown>;
  if (!data) throw new Error("Item cannot be null or undefined");
  if (!data.title) throw new Error("Title is required");
  if (!data.description) throw new Error("Description is required");
  
  if (category === 'sermon') {
    if (!data.speaker) throw new Error("Speaker is required for sermons");
    if (!data.videoUrl) throw new Error("Video URL is required for sermons");
  }
  if (category === 'event') {
    if (!data.date) throw new Error("Date is required for events");
    if (!data.location) throw new Error("Location is required for events");
  }
};

const safeExecute = async <T>(operation: () => Promise<T>, errorMessage: string): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    Logger.error(errorMessage, { error });
    throw error;
  }
};

export const api = {
  // --- READ ---
  getEvents: async (): Promise<IEvent[]> => {
    return safeExecute(async () => {
      await delay(500);
      const data = (await db.getItems('event')) as IEvent[];
      if (!Array.isArray(data)) throw new Error("Invalid data format for events");
      return data;
    }, "Failed to fetch events");
  },

  getSermons: async (): Promise<ISermon[]> => {
    return safeExecute(async () => {
      await delay(500);
      const data = (await db.getItems('sermon')) as ISermon[];
      if (!Array.isArray(data)) throw new Error("Invalid data format for sermons");
      return data;
    }, "Failed to fetch sermons");
  },

  getNews: async (): Promise<INewsItem[]> => {
    return safeExecute(async () => {
      await delay(500);
      const data = (await db.getItems('announcement')) as INewsItem[];
      if (!Array.isArray(data)) throw new Error("Invalid data format for news");
      return data;
    }, "Failed to fetch news");
  },

  // --- CREATE ---
  createItem: async (category: ContentCategory, item: Omit<ContentItem, 'id'>): Promise<void> => {
    return safeExecute(async () => {
      validateItem(item, category);
      await delay(500);
      const res = await db.createItem(category, item);
      if (!res.ok) throw new Error(res.error?.message || 'Failed to create');
    }, `Failed to create ${category}`);
  },

  // --- UPDATE ---
  updateItem: async (category: ContentCategory, id: string, updates: Partial<ContentItem>): Promise<void> => {
    return safeExecute(async () => {
      if (!id) throw new Error("ID is required for update");
      await delay(500);
      const res = await db.updateItem(category, id, updates);
      if (!res.ok) throw new Error(res.error?.message || 'Failed to update');
    }, `Failed to update ${category}`);
  },

  // --- DELETE ---
  deleteItem: async (category: ContentCategory, id: string): Promise<void> => {
    return safeExecute(async () => {
      if (!id) throw new Error("ID is required for deletion");
      await delay(500);
      const res = await db.deleteItem(category, id);
      if (!res.ok) throw new Error(res.error?.message || 'Failed to delete');
    }, `Failed to delete ${category}`);
  },

  adminGetItems: async (category: ContentCategory): Promise<ApiResponse<ContentItem[]>> => {
    try {
      let data: ContentItem[];
      if (category === 'event') data = await api.getEvents();
      else if (category === 'sermon') data = await api.getSermons();
      else data = await api.getNews();
      return { status: 200, data };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { status: 500, error: { code: 'FETCH_ERROR', message } };
    }
  },

  adminCreateItem: async (category: ContentCategory, item: Omit<ContentItem, 'id'>): Promise<ApiResponse<ContentItem>> => {
    try {
      await api.createItem(category, item);
      const created: ContentItem = { ...(item as ContentItem), id: Date.now().toString() };
      return { status: 200, data: created };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      const code = category === 'sermon' ? 'VALIDATION_SERMON' : category === 'event' ? 'VALIDATION_EVENT' : 'VALIDATION_ANNOUNCEMENT';
      return { status: 400, error: { code, message } };
    }
  },

  adminUpdateItem: async (category: ContentCategory, id: string, updates: Partial<ContentItem>): Promise<ApiResponse<null>> => {
    try {
      await api.updateItem(category, id, updates);
      return { status: 200, data: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { status: 400, error: { code: 'UPDATE_ERROR', message } };
    }
  },

  adminDeleteItem: async (category: ContentCategory, id: string): Promise<ApiResponse<null>> => {
    try {
      await api.deleteItem(category, id);
      return { status: 200, data: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { status: 400, error: { code: 'DELETE_ERROR', message } };
    }
  }
};
