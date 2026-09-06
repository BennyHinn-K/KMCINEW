import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const HomeHero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center text-primary overflow-hidden"
      data-theme="midnight"
    >
      <div className="absolute inset-0 z-0">
        {!reduceMotion ? (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.04 }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              scale: { duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'linear' },
            }}
            className="absolute inset-0 mask-fade-b"
          >
            <img
              src="/hero-bg.png"
              alt=""
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div aria-hidden className="absolute inset-0 mask-fade-b">
            <img
              src="/hero-bg.png"
              alt=""
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_47%_6%)]/97 via-[hsl(222_47%_8%)]/92 to-[hsl(222_47%_6%)]/99" />
        <div className="absolute inset-0 bg-mesh-aurora opacity-55 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div
          className="absolute pointer-events-none"
          style={{
            background:
              'radial-gradient(800px 500px at 50% 32%, hsl(var(--accent) / 0.18), transparent 70%)',
            inset: 0,
          }}
          aria-hidden
        />
        <div
          className="absolute pointer-events-none"
          style={{
            background:
              'radial-gradient(500px 320px at 18% 82%, hsl(var(--primary) / 0.22), transparent 70%)',
            inset: 0,
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-sm sm:px-md lg:px-lg py-section text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.85,
            ease: [0.16, 1, 0.3, 1],
            delay: reduceMotion ? 0 : 0.15,
          }}
        >
          <span
            className={cn(
              'inline-flex items-center gap-2xs py-xs px-md rounded-pill',
              'bg-black/35 backdrop-blur-md border border-white/15',
              'text-amber-300 eyebrow shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] mb-lg',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50'
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            Welcome to KMCI
          </span>

          <h1 className="text-display font-display font-bold tracking-tight mb-lg leading-[0.98] text-white text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            A center of{' '}
            <span className="gradient-text">transformation for missions</span>
          </h1>

          <div className="max-w-3xl mx-auto mb-xl">
            <blockquote
              className={cn(
                'relative pl-lg text-left border-l-[3px] border-amber-400/80 rounded-r-lg',
                'py-md pr-md my-lg bg-slate-900/40 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/5'
              )}
            >
              <p className="font-display italic text-lead text-white leading-relaxed text-pretty mb-md">
                “Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.”
              </p>
              <footer className="text-sm font-bold tracking-wide uppercase text-amber-300">
                — Matthew 28:19–20 (KJV)
              </footer>
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-xs sm:gap-sm">
            <Link
              to="/donate"
              className={cn(
                'group inline-flex items-center justify-center gap-xs',
                'px-lg py-md text-base font-bold text-slate-900 bg-amber-500 rounded-pill',
                'press-lift shadow-[0_10px_30px_-10px_rgba(251,191,36,0.65)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(222_47%_7%)]'
              )}
            >
              Partner with us
              <ArrowRight className="w-5 h-5 transition-transform duration-normal ease-emphasis group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className={cn(
                'inline-flex items-center justify-center gap-xs',
                'px-lg py-md text-base font-semibold text-white bg-white/10 rounded-pill',
                'border border-white/20 backdrop-blur-md',
                'press-lift shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] hover:bg-white/18 hover:border-amber-400/40',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(222_47%_7%)]'
              )}
            >
              Learn more
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
