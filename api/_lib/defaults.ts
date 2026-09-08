import type { IEvent, INewsItem, ISermon } from '../../src/types.js';

export const DEFAULT_EVENTS: IEvent[] = [
  {
    id: '1',
    title: 'Annual Kingdom Conference',
    date: '2024-08-15',
    time: '10:00 AM',
    location: 'Nairobi Main Hall',
    description:
      'Join us for three days of powerful worship, teaching, and impartation with guest speakers from around the world.',
    category: 'event',
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'Youth Revival Night',
    date: '2024-09-02',
    time: '6:00 PM',
    location: 'KMCI Center',
    description:
      'An evening dedicated to the next generation. Music, word, and fellowship for young adults and teenagers.',
    category: 'event',
    imageUrl:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_SERMONS: ISermon[] = [
  {
    id: '1',
    title: 'Walking in Divine Authority',
    speaker: 'Apostle John Doe',
    date: '2024-08-12',
    duration: '45 min',
    thumbnail:
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'sermon',
    featured: true,
    description: 'An empowering message on understanding and walking in the authority given to believers.',
  },
  {
    id: '2',
    title: 'The Power of Prayer',
    speaker: 'Pastor Jane Doe',
    date: '2024-08-05',
    duration: '52 min',
    thumbnail:
      'https://images.unsplash.com/photo-1543791187-df796fa110af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'sermon',
    description: 'Discover the transformative power of a consistent prayer life.',
  },
  {
    id: '3',
    title: 'Understanding Grace',
    speaker: 'Rev. Michael Smith',
    date: '2024-07-29',
    duration: '38 min',
    thumbnail:
      'https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'sermon',
    description: 'A deep dive into the concept of grace and how it applies to our daily lives.',
  },
  {
    id: '4',
    title: 'Kingdom Finance',
    speaker: 'Apostle John Doe',
    date: '2024-07-22',
    duration: '60 min',
    thumbnail:
      'https://images.unsplash.com/photo-1621508654686-809f23efdabc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'sermon',
    description: "Biblical principles for managing finances and prospering in God's kingdom.",
  },
];

export const DEFAULT_NEWS: INewsItem[] = [
  {
    id: '1',
    title: 'Community Food Drive',
    date: '2024-09-15',
    description: 'Join us as we collect non-perishable food items for local families in need.',
    imageUrl:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'announcement',
    featured: true,
  },
  {
    id: '2',
    title: 'Mid-Week Bible Study Resumes',
    date: '2024-09-20',
    description: 'Our Wednesday night Bible study series on the Book of Acts resumes this week.',
    imageUrl:
      'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'announcement',
  },
];
