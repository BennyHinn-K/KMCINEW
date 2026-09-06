import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
      <section className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-slate-900 text-white py-16 px-8 md:px-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh-aurora opacity-60" aria-hidden />
            <div className="absolute inset-0 grain-overlay pointer-events-none" aria-hidden />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-8">
                <Compass className="w-4 h-4 text-accent mr-2" />
                <span className="text-accent text-xs font-bold uppercase tracking-widest">
                  Page not found
                </span>
              </div>
              <h1 className="font-display font-bold text-display leading-none text-primary mb-6">
                404
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
                The page you&apos;re looking for doesn&apos;t exist
              </p>
              <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
                It may have been moved, renamed, or perhaps it was never here to begin with.
                Let&apos;s get you back on track.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all press-lift w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-accent-foreground bg-accent hover:bg-accent/90 shadow-3 hover:shadow-glow transition-all press-lift w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <div className="bg-gray-50 border-t border-gray-100 p-8 md:p-10">
            <h3 className="text-center font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm text-gray-500">
              Try these instead
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/ministries', label: 'Ministries' },
                { to: '/announcements', label: 'News' },
                { to: '/donate', label: 'Give' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-center px-3 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default NotFound;
