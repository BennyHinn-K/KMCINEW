import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { brandLogo } from '../branding';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'News', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-normal ease-standard',
        scrolled
          ? 'bg-[hsl(222_47%_11%)]/95 backdrop-blur-xl shadow-2 border-b border-white/10'
          : 'bg-[hsl(222_47%_11%)]/80 backdrop-blur-md border-b border-white/5'
      )}
    >
      <div className="max-w-7xl mx-auto px-sm sm:px-md lg:px-lg">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2 group focus:outline-none">
            <div className="p-xs rounded-lg bg-white/10 shadow-2 border border-white/15 text-white transition-transform duration-normal ease-emphasis group-hover:-translate-y-0.5">
              <img
                src={brandLogo}
                alt="KMCI logo"
                className="w-8 h-8 rounded-md object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none tracking-tight text-white">
                KMCI
              </span>
              <span className="text-[0.65rem] uppercase tracking-widest font-medium text-white/70">
                Kingdom Missions
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative text-sm font-medium transition-colors duration-fast ease-standard uppercase tracking-wide px-xs py-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_11%)]',
                  location.pathname === link.path
                    ? 'text-amber-400'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-amber-400/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative z-10">
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </span>
              </Link>
            ))}
            <Link
              to="/donate"
              className="group bg-amber-500 text-slate-900 px-md py-xs rounded-pill text-sm font-bold press-lift shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_10px_30px_-10px_rgba(251,191,36,0.6)] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_11%)]"
            >
              <Heart className="w-4 h-4 mr-2 fill-current transition-transform duration-normal ease-emphasis group-hover:scale-110" />
              Give
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_11%)] rounded-md p-xs text-white transition-colors duration-fast hover:text-amber-400"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="md:hidden bg-[hsl(222_42%_14%)] border-t border-white/10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] mx-sm sm:mx-md mt-xs rounded-2xl mb-sm ring-1 ring-white/5"
          >
            <div className="px-md pt-md pb-lg space-y-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-md py-md rounded-xl text-base font-semibold transition-all duration-fast ease-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_14%)]',
                    location.pathname === link.path
                      ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30'
                      : 'text-white/85 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="flex items-center justify-between">
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                    )}
                  </span>
                </Link>
              ))}
              <div className="pt-md">
                <Link
                  to="/donate"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-amber-500 text-slate-900 px-md py-md rounded-xl font-bold press-lift shadow-[0_10px_30px_-10px_rgba(251,191,36,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
                >
                  <span className="inline-flex items-center justify-center">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Give
                  </span>
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
