import type { ContentCategory, ContentItem } from '../../src/types.js';

export function validateItem(item: unknown, category: ContentCategory): void {
  const data = item as Record<string, unknown>;
  if (!data) throw new Error('Item cannot be null or undefined');
  if (!data.title || typeof data.title !== 'string') throw new Error('Title is required');
  if (data.title.length > 200) throw new Error('Title must be 200 characters or less');
  if (!data.description || typeof data.description !== 'string') throw new Error('Description is required');
  if (data.description.length > 5000) throw new Error('Description must be 5000 characters or less');

  if (category === 'sermon') {
    throw new Error('Sermon management is not available');
  }
  if (category === 'event') {
    if (!data.date) throw new Error('Date is required for events');
    if (!data.location || typeof data.location !== 'string') throw new Error('Location is required for events');
    if (data.location.length > 300) throw new Error('Location must be 300 characters or less');
  }

  const imageUrl = data.imageUrl as unknown;
  if (imageUrl !== undefined && imageUrl !== null && imageUrl !== '') {
    if (typeof imageUrl !== 'string') throw new Error('Image URL must be a string');
    if (imageUrl.startsWith('data:')) {
      throw new Error(
        'Embedded image data (data:) is not supported. Upload to an image host (e.g. Unsplash, Vercel Blob) and paste the public URL instead.'
      );
    }
    if (imageUrl.length > 2048) throw new Error('Image URL must be 2048 characters or less');
    try {
      const parsed = new URL(imageUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Image URL must use http:// or https://');
      }
    } catch {
      throw new Error('Image URL must be a valid http(s) URL');
    }
  }
}

export function isManagedCategory(category: string): category is Extract<ContentCategory, 'event' | 'announcement'> {
  return category === 'event' || category === 'announcement';
}

export function asContentItem(item: Omit<ContentItem, 'id'> & { id?: string }, id: string): ContentItem {
  return { ...item, id } as ContentItem;
}
