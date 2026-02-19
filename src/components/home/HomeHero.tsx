import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeHero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80" 
          alt="Worship Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-900/70 to-gray-950/95 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-bold tracking-wider uppercase mb-6">
            Welcome to KMCI
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            A center of <br />
            <span className="text-amber-400">transformation for missions</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Empowering believers to fulfill the Great Commission through evangelism, discipleship, and humanitarian outreach.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-amber-500 rounded-full hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
            >
              Give
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
