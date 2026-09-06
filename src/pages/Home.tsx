import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Megaphone, ArrowRight, ImageIcon, AlertCircle, Star } from 'lucide-react';
import HomeHero from '../components/home/HomeHero';
import ImpactArea from '../components/home/ImpactArea';
import TiltCard from '../components/TiltCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { api } from '../lib/api';
import { INewsItem, IEvent } from '../types';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<(IEvent | INewsItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [news, events] = await Promise.all([api.getNews(), api.getEvents()]);
        const featured = [...news, ...events]
          .filter((item) => item.featured)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6);
        setFeaturedItems(featured);
      } catch {
        setError('Failed to load featured content.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden bg-gray-50">
      <HomeHero />
      <ImpactArea />

      {/* Featured Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">What's Happening</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Content</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay connected with our latest announcements and upcoming events.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center flex items-center justify-center max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LoadingSkeleton count={3} />
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-2">No featured content yet</p>
              <p className="text-gray-500 mb-6">Check back soon for announcements and events.</p>
              <Link
                to="/announcements"
                className="inline-flex items-center text-amber-600 font-bold hover:text-amber-700 transition-colors"
              >
                View All Announcements & Events <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredItems.map((item) => (
                  <TiltCard key={`${item.category}-${item.id}`}>
                    <div className="bg-slate-900 text-gray-100 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full group">
                      <div className="relative h-48 overflow-hidden bg-slate-800">
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
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold uppercase text-white inline-flex items-center gap-1 ${
                              item.category === 'event' ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                          >
                            {item.category === 'event' ? (
                              <>
                                <Calendar className="w-3 h-3" />
                                Event
                              </>
                            ) : (
                              <>
                                <Megaphone className="w-3 h-3" />
                                Announcement
                              </>
                            )}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </div>
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center text-sm text-amber-500 font-bold mb-3 uppercase tracking-wider">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(item.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {item.category === 'event' && (item as IEvent).time && (
                            <span className="ml-2 text-amber-400/80">· {(item as IEvent).time}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-100 mb-3">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed flex-grow line-clamp-3">
                          {item.description}
                        </p>
                        {item.category === 'event' && (item as IEvent).location && (
                          <div className="mt-4 pt-4 border-t border-slate-700/50 text-sm text-gray-400">
                            <span className="inline-flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                              {(item as IEvent).location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/announcements"
                  className="inline-flex items-center bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors shadow-lg"
                >
                  View All Announcements & Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Partner with the Vision</h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
            Your generosity helps us take the Gospel to the nations, support orphans, and build the Kingdom of God.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/donate"
              className="inline-block bg-amber-500 text-white font-bold py-4 px-10 rounded-full hover:bg-amber-600 transition-colors shadow-lg"
            >
              Give
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
