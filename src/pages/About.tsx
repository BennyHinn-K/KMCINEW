import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Star, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import RadialOrbitalTimeline from '../components/ui/radial-orbital-timeline';

const About = () => {
  const timelineData = [
    {
      id: 1,
      title: "Foundation",
      date: "2010",
      content: "KMCI was founded with a vision to reach the lost and empower believers.",
      category: "History",
      icon: Shield,
      relatedIds: [2],
      status: "completed" as const,
      energy: 100,
    },
    {
      id: 2,
      title: "Integrity",
      date: "Core Value",
      content: "We uphold the highest standards of biblical ethics and transparency.",
      category: "Values",
      icon: Star,
      relatedIds: [1, 3],
      status: "completed" as const,
      energy: 90,
    },
    {
      id: 3,
      title: "Compassion",
      date: "Core Value",
      content: "Moved by the needs of others, we are committed to practical acts of love.",
      category: "Values",
      icon: Heart,
      relatedIds: [2, 4],
      status: "completed" as const,
      energy: 85,
    },
    {
      id: 4,
      title: "Excellence",
      date: "Core Value",
      content: "We believe God deserves our best in ministry and stewardship.",
      category: "Values",
      icon: CheckCircle,
      relatedIds: [3, 5],
      status: "completed" as const,
      energy: 80,
    },
    {
      id: 5,
      title: "Global Reach",
      date: "Future",
      content: "Expanding our mission to every continent and nation.",
      category: "Vision",
      icon: Users,
      relatedIds: [4],
      status: "in-progress" as const,
      energy: 70,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Who We Are</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A global family of believers united by a passion for God and compassion for people.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="KMCI Congregation" 
                  className="rounded-2xl shadow-2xl z-10 relative"
                />
                <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-amber-500 rounded-2xl -z-0 hidden md:block"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Our Identity</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">More Than Just a Church</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kingdom Missions Center International (KMCI) is a vibrant community dedicated to transforming lives through the power of the Holy Spirit.
              </p>
              
              <div className="bg-white p-6 rounded-xl border-l-4 border-slate-900 shadow-sm mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h4>
                <p className="text-gray-700 italic">
                  "To preach the Gospel of the Kingdom to all nations, discipling believers to walk in their God-given purpose and authority."
                </p>
              </div>

              <Link 
                to="/contact" 
                className="inline-block bg-amber-500 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
              >
                Signup Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Timeline */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Our DNA</h2>
            <h3 className="text-3xl font-bold text-white">Core Values & History</h3>
          </div>
          
          <div className="relative h-[600px] w-full">
             <RadialOrbitalTimeline timelineData={timelineData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
