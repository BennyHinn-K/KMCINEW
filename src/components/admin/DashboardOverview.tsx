import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Megaphone, BookOpen, Sparkles, Star } from 'lucide-react';
import { api } from '../../lib/api';
import { ContentItem, IEvent, INewsItem, ManagedCategory } from '../../types';
import { cn } from '../../lib/utils';
import { brandLogo } from '../../branding';

interface CategoryMeta {
  key: ManagedCategory;
  label: string;
  eyebrow: string;
  icon: React.ElementType;
  accent: string;
  soft: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'event',
    label: 'Events',
    eyebrow: 'Gatherings',
    icon: Calendar,
    accent: 'from-amber-500/35 to-orange-500/20',
    soft: 'text-amber-300 bg-amber-500/15 border-amber-400/30',
  },
  {
    key: 'announcement',
    label: 'Announcements',
    eyebrow: 'Comms',
    icon: Megaphone,
    accent: 'from-emerald-500/30 to-teal-500/20',
    soft: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30',
  },
];

interface StatCardData {
  meta: CategoryMeta;
  total: number;
  featured: number;
  loading: boolean;
}

const DashboardOverview: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState<StatCardData[]>(
    CATEGORIES.map((meta) => ({ meta, total: 0, featured: 0, loading: true }))
  );
  const [featured, setFeatured] = useState<{ meta: CategoryMeta; item: ContentItem }[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        CATEGORIES.map(async (meta) => {
          try {
            const res = await api.adminGetItems(meta.key);
            const list: ContentItem[] = res.status === 200 && Array.isArray(res.data) ? res.data : [];
            return {
              meta,
              total: list.length,
              featured: list.filter((i) => i.featured).length,
              loading: false,
              sample: list,
            };
          } catch {
            return { meta, total: 0, featured: 0, loading: false, sample: [] as ContentItem[] };
          }
        })
      );
      if (cancelled) return;
      setStats(results.map(({ meta, total, featured, loading }) => ({ meta, total, featured, loading })));
      const picks: { meta: CategoryMeta; item: ContentItem }[] = [];
      for (const r of results) {
        const f = r.sample.filter((i) => i.featured).slice(0, 2);
        f.forEach((item) => picks.push({ meta: r.meta, item }));
        if (f.length === 0 && r.sample.length > 0) {
          picks.push({ meta: r.meta, item: r.sample[0] });
        }
      }
      setFeatured(picks.slice(0, 6));
      setFeaturedLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: 0.07, delayChildren: 0.05 },
    },
  };

  const cell = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="space-y-2xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="surface-glass relative overflow-hidden rounded-xl border border-border/60 p-md sm:p-lg shadow-1"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-aurora opacity-60 mix-blend-screen" />
        <motion.div variants={cell} className="relative z-10 flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-md min-w-0">
            <div className="bg-surface/70 backdrop-blur-sm p-2 rounded-xl border border-border/60 shadow-1 flex-shrink-0">
              <img src={brandLogo} alt="" className="h-10 w-10 rounded-lg object-contain" />
            </div>
            <div className="min-w-0">
              <span className="eyebrow inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-accent font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Quick-pulse of your content
              </span>
              <h2 className="headline font-display font-bold text-2xl sm:text-3xl mt-1 mb-xs leading-[1.1] text-primary">
                Dashboard
              </h2>
              <p className="text-sm text-ink-muted max-w-xl leading-relaxed">
                Add and remove events and announcements. Changes publish to the public site immediately.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-xs">
            <div className="px-3 py-1.5 rounded-pill text-xs font-semibold border bg-accent/15 text-accent border-accent/30 shadow-1">
              {stats.reduce((a, s) => a + s.total, 0)} total items
            </div>
            <div className="px-3 py-1.5 rounded-pill text-xs font-semibold border bg-success/15 text-success-foreground border-success/30 shadow-1">
              {stats.reduce((a, s) => a + s.featured, 0)} featured
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {stats.map(({ meta, total, featured, loading }) => {
          const Icon = meta.icon;
          const label = loading ? 'loading' : `${total} total, ${featured} featured`;
          return (
            <motion.div
              key={meta.key}
              variants={cell}
              className={cn(
                'group relative overflow-hidden rounded-xl border border-border/60 p-md shadow-1',
                'bg-surface/70 backdrop-blur-md',
                'press-lift transition-colors duration-normal ease-emphasis hover:border-accent/40'
              )}
              tabIndex={0}
              role="group"
              aria-label={`${meta.label}: ${label}`}
            >
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-soft-light transition-opacity duration-slow',
                  meta.accent,
                  'group-hover:opacity-60'
                )}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-xs mb-md">
                  <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg border shadow-1', meta.soft)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-[10px] uppercase tracking-[0.18em] text-ink-subtle/90 font-semibold">
                    {meta.eyebrow}
                  </span>
                </div>
                <h3 className="headline text-base font-bold text-primary mb-1">{meta.label}</h3>
                <div className="flex items-baseline gap-xs">
                  <div className="font-display font-bold text-4xl leading-none text-primary tracking-tight" aria-live="polite">
                    {loading ? '—' : total}
                  </div>
                  <span className="text-xs text-ink-subtle">total</span>
                </div>
                <div className="divider-gradient my-md" />
                <div className="flex items-center justify-between gap-xs text-xs">
                  <span className="text-ink-muted inline-flex items-center gap-1.5">
                    <Star className={cn('h-3.5 w-3.5', featured > 0 ? 'fill-accent text-accent' : 'text-ink-subtle')} />
                    Featured
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 font-semibold shadow-1',
                      featured > 0 ? meta.soft : 'text-ink-subtle bg-surface-elevated border-border/60'
                    )}
                  >
                    {loading ? '—' : featured}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="surface-glass relative overflow-hidden rounded-xl border border-border/60 shadow-1"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 grain-overlay opacity-60" />
        <motion.div variants={cell} className="relative z-10 flex items-center justify-between px-md sm:px-lg pt-md sm:pt-lg pb-xs">
          <div>
            <span className="eyebrow text-[11px] uppercase tracking-[0.18em] text-accent font-semibold inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Shown on the site
            </span>
            <h3 className="headline font-display font-bold text-xl sm:text-2xl mt-1 text-primary">Featured content</h3>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-xs sm:gap-md px-md sm:px-lg pb-md sm:pb-lg pt-xs"
        >
          {featuredLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                variants={cell}
                className="rounded-xl border border-border/60 bg-surface/60 p-xs sm:p-sm shimmer-bg h-28"
              />
            ))
          ) : featured.length === 0 ? (
            <motion.div
              variants={cell}
              className="md:col-span-2 rounded-xl border border-dashed border-border/70 bg-surface/40 p-lg text-center"
            >
              <p className="text-sm font-semibold text-primary mb-1">Nothing featured yet.</p>
              <p className="text-xs text-ink-muted">Star an event or announcement to surface it here and on the public site.</p>
            </motion.div>
          ) : (
            featured.map(({ meta, item }) => {
              const Icon = meta.icon;
              const thumb = (item as IEvent | INewsItem).imageUrl || '';
              const metaLine = item.category === 'event' ? (item as IEvent).location || '—' : (item as INewsItem).date || '—';
              return (
                <motion.article
                  key={`${meta.key}-${item.id}`}
                  variants={cell}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border border-border/60 bg-surface/70 backdrop-blur-sm',
                    'shadow-1 press-lift transition-colors duration-normal ease-emphasis hover:border-accent/40'
                  )}
                >
                  <div className="aspect-[16/9] w-full bg-surface-elevated overflow-hidden relative">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-slow ease-emphasis group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-ink-subtle/60">
                        <Icon className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-xs left-xs">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-1',
                          meta.soft
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>
                    {item.featured && (
                      <div className="absolute top-xs right-xs inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="p-xs sm:p-sm">
                    <h4 className="headline font-bold text-sm text-primary truncate mb-0.5 leading-tight">{item.title}</h4>
                    <p className="text-xs text-ink-muted truncate mb-xs">{metaLine}</p>
                    {item.description && (
                      <p className="text-xs text-ink-subtle line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </motion.article>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
