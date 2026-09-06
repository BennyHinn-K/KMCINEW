import type { ContentCategory, ContentItem } from '../../src/types';

export function validateItem(item: unknown, category: ContentCategory): void {
  const data = item as Record<string, unknown>;
  if (!data) throw new Error('Item cannot be null or undefined');
  if (!data.title) throw new Error('Title is required');
  if (!data.description) throw new Error('Description is required');

  if (category === 'sermon') {
    throw new Error('Sermon management is not available');
  }
  if (category === 'event') {
    if (!data.date) throw new Error('Date is required for events');
    if (!data.location) throw new Error('Location is required for events');
  }
}

export function isManagedCategory(category: string): category is Extract<ContentCategory, 'event' | 'announcement'> {
  return category === 'event' || category === 'announcement';
}

export function asContentItem(item: Omit<ContentItem, 'id'> & { id?: string }, id: string): ContentItem {
  return { ...item, id } as ContentItem;
}
