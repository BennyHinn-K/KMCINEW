import { useEffect, useState } from 'react';
import { Play, Calendar, Clock, AlertCircle, Video } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { api } from '../lib/api';
import { ISermon } from '../types';

const Sermons = () => {
  const [sermons, setSermons] = useState<ISermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const data = await api.getSermons();
        setSermons(data);
      } catch {
        setError("Failed to load sermons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  const featuredSermon = sermons.find(s => s.featured) || sermons[0];
  const otherSermons = sermons.filter(s => s.id !== featuredSermon?.id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sermons & Media</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch recent messages and grow in your faith.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Featured Sermon */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-amber-500 pl-4">Latest Message</h2>
            {loading ? (
              <LoadingSkeleton count={1} className="h-[400px]" />
            ) : featuredSermon ? (
              <TiltCard>
                <div className="relative rounded-xl overflow-hidden shadow-2xl group cursor-pointer h-[400px] md:h-[500px] bg-slate-900">
                  {featuredSermon.thumbnail ? (
                    <img 
                      src={featuredSermon.thumbnail} 
                      alt={featuredSermon.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 opacity-80 group-hover:opacity-60 transition-opacity">
                      <Video className="w-24 h-24 text-slate-600" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="bg-amber-500/90 p-4 rounded-full text-white transform group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-10 h-10 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8 text-white">
                    <span className="bg-amber-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">FEATURED</span>
                    <h3 className="text-3xl font-bold mb-2">{featuredSermon.title}</h3>
                    <p className="text-gray-300">{featuredSermon.speaker} • {featuredSermon.date}</p>
                  </div>
                </div>
              </TiltCard>
            ) : (
                <div className="text-center py-10 text-gray-500">No sermons available.</div>
            )}
          </div>

          {/* Sermon Grid */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-slate-900 pl-4">Recent Messages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              otherSermons.map((sermon) => (
                <TiltCard key={sermon.id} className="h-full">
                  <div className="group cursor-pointer bg-slate-900 text-gray-100 rounded-xl shadow-2xl h-full flex flex-col overflow-hidden">
                    <div className="relative overflow-hidden aspect-video bg-slate-800">
                      {sermon.thumbnail ? (
                        <img 
                          src={sermon.thumbnail} 
                          alt={sermon.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 p-3 rounded-full text-slate-900">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {sermon.duration}
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-gray-100 group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">{sermon.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{sermon.speaker}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-auto">
                        <Calendar className="w-3 h-3 mr-1" /> {sermon.date}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
