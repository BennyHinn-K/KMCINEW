import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Heart, Users } from 'lucide-react';
import TiltCard from '../TiltCard';

const ImpactArea = () => {
  const features = [
    {
      icon: <Globe className="w-10 h-10 text-white" />,
      title: "Global Missions",
      description: "Reaching the unreached in Kenya and beyond through evangelistic crusades and church planting.",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Discipleship",
      description: "Equipping believers with biblical truth to grow in faith and leadership within their communities.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Heart className="w-10 h-10 text-white" />,
      title: "Humanitarian Aid",
      description: "Demonstrating God's love through practical support, education, and community development projects.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Our Focus</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Impact Areas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <TiltCard key={index} className="h-96">
              <div className="relative h-full w-full overflow-hidden rounded-xl shadow-2xl bg-slate-900 group">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-8 text-gray-100 z-10">
                  <div className="bg-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <Link to="/ministries" className="text-amber-400 font-bold flex items-center text-sm uppercase tracking-wide">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactArea;
