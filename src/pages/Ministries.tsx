import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Globe, BookOpen, Music, Baby, ChevronDown } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const Ministries = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const ministries = [
    {
      id: 1,
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Men's Ministry",
      description: "Empowering men to be spiritual leaders in their homes and communities through fellowship and mentorship.",
      details: "We meet monthly for breakfast fellowships, annual retreats, and mentorship programs for young men.",
      color: "bg-blue-600"
    },
    {
      id: 2,
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Women's Ministry",
      description: "A sisterhood of faith supporting women to grow in grace, wisdom, and purpose.",
      details: "Weekly prayer meetings, 'Daughters of the King' conferences, and community support groups.",
      color: "bg-pink-600"
    },
    {
      id: 3,
      icon: <Baby className="w-8 h-8 text-white" />,
      title: "Children & Youth",
      description: "Raising the next generation of Kingdom giants through engaging biblical teaching and activities.",
      details: "Sunday school for ages 3-12, Teen church (13-19), and annual Vacation Bible School.",
      color: "bg-amber-500"
    },
    {
      id: 4,
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Missions & Outreach",
      description: "Taking the gospel to the streets and the nations, providing aid to the needy and hope to the hopeless.",
      details: "Quarterly mission trips, hospital visitations, and street evangelism drives.",
      color: "bg-green-600"
    },
    {
      id: 5,
      icon: <BookOpen className="w-8 h-8 text-white" />,
      title: "School of Ministry",
      description: "In-depth theological training and practical ministry preparation for aspiring leaders.",
      details: "6-month certificate courses in Theology, Leadership, and Church Planting.",
      color: "bg-purple-600"
    },
    {
      id: 6,
      icon: <Music className="w-8 h-8 text-white" />,
      title: "Worship Arts",
      description: "Cultivating an atmosphere of heaven on earth through music, dance, and creative arts.",
      details: "Choir practice on Saturdays, dance ministry, and technical production team training.",
      color: "bg-indigo-600"
    }
  ];

  const toggleDropdown = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Ministries</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            There is a place for everyone at KMCI. Discover where you can serve, grow, and belong.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry) => (
              <TiltCard key={ministry.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group h-full flex flex-col">
                  <div className={`${ministry.color} p-6 flex justify-center items-center`}>
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      {ministry.icon}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{ministry.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {ministry.description}
                    </p>
                    
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(ministry.id)}
                        className="text-gray-900 font-bold hover:text-amber-600 flex items-center uppercase text-sm tracking-wide focus:outline-none"
                      >
                        Get Involved <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${activeDropdown === ministry.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === ministry.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700"
                          >
                            <p className="font-semibold mb-2 text-amber-600">Impact & Engagement:</p>
                            <p>{ministry.details}</p>
                            <button className="mt-3 w-full bg-gray-900 text-white py-2 rounded text-xs font-bold hover:bg-gray-800">
                              Sign Up Now
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
