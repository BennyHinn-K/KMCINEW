import { LucideIcon } from 'lucide-react';

export type ContentCategory = 'sermon' | 'event' | 'announcement';

export interface IBaseContent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  featured?: boolean;
  category: ContentCategory;
}

export interface IEvent extends IBaseContent {
  category: 'event';
  time?: string;
  location?: string;
}

export interface ISermon extends Omit<IBaseContent, 'imageUrl' | 'category'> {
  category: 'sermon';
  speaker: string;
  duration: string;
  thumbnail: string; // Replaces imageUrl for sermons
  videoUrl?: string;
}

export interface INewsItem extends IBaseContent {
  category: 'announcement';
}

export type ContentItem = IEvent | ISermon | INewsItem;

export type DashboardTab = 'overview' | 'events' | 'announcements' | 'live';

export interface DashboardStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  visitors: number;
  views: number;
}
