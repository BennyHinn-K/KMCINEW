import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'News', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-white/10 text-white border border-white/10">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V21a.75.75 0 01-1.5 0V9.75H6a.75.75 0 010-1.5h5.25V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none tracking-tight text-white">
                KMCI
              </span>
              <span className="text-[0.65rem] uppercase tracking-widest font-medium text-gray-400">
                Kingdom Missions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-amber-500 uppercase tracking-wide',
                  location.pathname === link.path
                    ? 'text-amber-500 font-semibold'
                    : 'text-gray-300'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/donate"
              className="bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Give
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none text-white"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-4 pb-8 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-slate-800 text-amber-500'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-2">
                <Link
                  to="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-amber-500 text-white px-5 py-4 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md"
                >
                  Give
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
