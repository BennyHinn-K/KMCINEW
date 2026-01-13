import { Logger } from './logger';
import { IEvent, ISermon, INewsItem, ContentItem, ContentCategory } from '../types';
import { StorageManager } from './storage';
 
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: ApiError;
}

// Mock Data Defaults
const DEFAULT_EVENTS: IEvent[] = [
  {
    id: '1',
    title: 'Annual Kingdom Conference',
    date: '2024-08-15',
    time: '10:00 AM',
    location: 'Nairobi Main Hall',
    description: 'Join us for three days of powerful worship, teaching, and impartation with guest speakers from around the world.',
    category: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'Youth Revival Night',
    date: '2024-09-02',
    time: '6:00 PM',
    location: 'KMCI Center',
    description: 'An evening dedicated to the next generation. Music, word, and fellowship for young adults and teenagers.',
    category: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_SERMONS: ISermon[] = [
  {
    id: '1',
    title: "Walking in Divine Authority",
    speaker: "Apostle John Doe",
    date: "2024-08-12",
    duration: "45 min",
    thumbnail: "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: 'sermon',
    featured: true,
    description: "An empowering message on understanding and walking in the authority given to believers."
  },
  {
    id: '2',
    title: "The Power of Prayer",
    speaker: "Pastor Jane Doe",
    date: "2024-08-05",
    duration: "52 min",
    thumbnail: "https://images.unsplash.com/photo-1543791187-df796fa110af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: 'sermon',
    description: "Discover the transformative power of a consistent prayer life."
  },
  {
    id: '3',
    title: "Understanding Grace",
    speaker: "Rev. Michael Smith",
    date: "2024-07-29",
    duration: "38 min",
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: 'sermon',
    description: "A deep dive into the concept of grace and how it applies to our daily lives."
  },
  {
    id: '4',
    title: "Kingdom Finance",
    speaker: "Apostle John Doe",
    date: "2024-07-22",
    duration: "60 min",
    thumbnail: "https://images.unsplash.com/photo-1621508654686-809f23efdabc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: 'sermon',
    description: "Biblical principles for managing finances and prospering in God's kingdom."
  }
];

const DEFAULT_NEWS: INewsItem[] = [
  {
    id: '1',
    title: 'Community Food Drive',
    date: '2024-09-15',
    description: 'Join us as we collect non-perishable food items for local families in need.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'announcement',
    featured: true
  },
  {
    id: '2',
    title: 'Mid-Week Bible Study Resumes',
    date: '2024-09-20',
    description: 'Our Wednesday night Bible study series on the Book of Acts resumes this week.',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'announcement'
  }
];

// Local Storage Keys
const STORAGE_KEYS = {
  EVENTS: 'kmci_events',
  SERMONS: 'kmci_sermons',
  NEWS: 'kmci_news'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      const data = StorageManager.getItem<IEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
      if (!Array.isArray(data)) throw new Error("Invalid data format for events");
      return data;
    }, "Failed to fetch events");
  },

  getSermons: async (): Promise<ISermon[]> => {
    return safeExecute(async () => {
      await delay(500);
      const data = StorageManager.getItem<ISermon[]>(STORAGE_KEYS.SERMONS, DEFAULT_SERMONS);
      if (!Array.isArray(data)) throw new Error("Invalid data format for sermons");
      return data;
    }, "Failed to fetch sermons");
  },

  getNews: async (): Promise<INewsItem[]> => {
    return safeExecute(async () => {
      await delay(500);
      const data = StorageManager.getItem<INewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
      if (!Array.isArray(data)) throw new Error("Invalid data format for news");
      return data;
    }, "Failed to fetch news");
  },

  // --- CREATE ---
  createItem: async (category: ContentCategory, item: Omit<ContentItem, 'id'>): Promise<void> => {
    return safeExecute(async () => {
      validateItem(item, category);
      await delay(500);
      const newItem = { ...item, id: Date.now().toString() };
      
      if (category === 'event') {
        const items = StorageManager.getItem<IEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
        StorageManager.setItem(STORAGE_KEYS.EVENTS, [newItem as IEvent, ...items]);
      } else if (category === 'sermon') {
        const items = StorageManager.getItem<ISermon[]>(STORAGE_KEYS.SERMONS, DEFAULT_SERMONS);
        StorageManager.setItem(STORAGE_KEYS.SERMONS, [newItem as ISermon, ...items]);
      } else {
        const items = StorageManager.getItem<INewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
        StorageManager.setItem(STORAGE_KEYS.NEWS, [newItem as INewsItem, ...items]);
      }
    }, `Failed to create ${category}`);
  },

  // --- UPDATE ---
  updateItem: async (category: ContentCategory, id: string, updates: Partial<ContentItem>): Promise<void> => {
    return safeExecute(async () => {
      if (!id) throw new Error("ID is required for update");
      await delay(500);
      
      if (category === 'event') {
        const items = StorageManager.getItem<IEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
        const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
        StorageManager.setItem(STORAGE_KEYS.EVENTS, updated);
      } else if (category === 'sermon') {
        const items = StorageManager.getItem<ISermon[]>(STORAGE_KEYS.SERMONS, DEFAULT_SERMONS);
        const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
        StorageManager.setItem(STORAGE_KEYS.SERMONS, updated);
      } else {
        const items = StorageManager.getItem<INewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
        const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
        StorageManager.setItem(STORAGE_KEYS.NEWS, updated);
      }
    }, `Failed to update ${category}`);
  },

  // --- DELETE ---
  deleteItem: async (category: ContentCategory, id: string): Promise<void> => {
    return safeExecute(async () => {
      if (!id) throw new Error("ID is required for deletion");
      await delay(500);
      
      if (category === 'event') {
        const items = StorageManager.getItem<IEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
        StorageManager.setItem(STORAGE_KEYS.EVENTS, items.filter(i => i.id !== id));
      } else if (category === 'sermon') {
        const items = StorageManager.getItem<ISermon[]>(STORAGE_KEYS.SERMONS, DEFAULT_SERMONS);
        StorageManager.setItem(STORAGE_KEYS.SERMONS, items.filter(i => i.id !== id));
      } else {
        const items = StorageManager.getItem<INewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
        StorageManager.setItem(STORAGE_KEYS.NEWS, items.filter(i => i.id !== id));
      }
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
