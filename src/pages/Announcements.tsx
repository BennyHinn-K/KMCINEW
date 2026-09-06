import React, { useState, useEffect } from 'react';
import { Calendar, ImageIcon, AlertCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { api } from '../lib/api';
import { INewsItem, IEvent } from '../types';

type FilterType = 'all' | 'announcement' | 'event';

const Announcements = () => {
  const [items, setItems] = useState<(INewsItem | IEvent)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [news, events] = await Promise.all([api.getNews(), api.getEvents()]);
        setItems([...news, ...events]);
      } catch {
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  const categories: FilterType[] = ['all', 'announcement', 'event'];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-2">News & Media</h1>
          <p className="text-gray-300">Stay updated with announcements and events.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-2 overflow-x-auto pb-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                filter === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <LoadingSkeleton count={3} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <TiltCard key={`${item.category}-${item.id}`}>
                <div className="bg-slate-900 text-gray-100 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-slate-800 group">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase text-white ${
                            item.category === 'event' ? 'bg-green-600' : 'bg-blue-600'
                        }`}>
                            {item.category}
                        </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-amber-500 font-bold mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed flex-grow">
                      {item.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;
