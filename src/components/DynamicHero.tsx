import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import type { CarWallpaper } from '../constants';
import { brandToUrl, seededShuffle } from '../utils';

type HeroMode = 'brand' | 'week' | 'new';

interface DynamicHeroProps {
  wallpapers: CarWallpaper[];
  subtitle: string;
}

const MODE_SEQUENCE: HeroMode[] = ['brand', 'week', 'new'];

// How long each state holds before transitioning to the next (ms).
const HOLD_MS: Record<HeroMode, number> = {
  brand: 4200,
  week: 3200,
  new: 3200,
};

/** ISO-ish week key so "Wallpaper of the Week" is stable for the whole week, not per-render. */
function getWeekKey(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((+now - +start) / 86400000);
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export default function DynamicHero({ wallpapers, subtitle }: DynamicHeroProps) {
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const [modeIndex, setModeIndex] = useState(0);
  const mode = MODE_SEQUENCE[modeIndex];

  const weekWallpaper = useMemo(() => {
    if (wallpapers.length === 0) return null;
    return seededShuffle(wallpapers, getWeekKey())[0];
  }, [wallpapers]);

  // Newest entry = highest sequential id, i.e. the last item in the array
  // (see optimize-and-scan.ts, which assigns ids sequentially on each run).
  const newWallpaper = wallpapers.length ? wallpapers[wallpapers.length - 1] : null;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const current = MODE_SEQUENCE[modeIndex];
    const t = setTimeout(() => {
      setModeIndex((prev) => (prev + 1) % MODE_SEQUENCE.length);
    }, HOLD_MS[current]);
    return () => clearTimeout(t);
  }, [modeIndex, prefersReducedMotion]);

  // Static fallback: reduced-motion preference, or not enough data to animate.
  if (prefersReducedMotion || !weekWallpaper || !newWallpaper) {
    return (
      <section className="mb-10 md:mb-14 overflow-visible">
        <h1 className="flex items-end leading-[0.9] uppercase select-none overflow-visible">
          <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-white">VELO</span>
          <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-zinc-500">CITY</span>
        </h1>
        <div className="flex items-center gap-4 mt-5">
          <div className="h-px bg-zinc-900 flex-1" />
          <p className="text-[10px] md:text-[12px] uppercase tracking-[0.45em] text-zinc-400 font-black whitespace-nowrap">
            {subtitle}
          </p>
        </div>
      </section>
    );
  }

  const active = mode === 'week' ? weekWallpaper : mode === 'new' ? newWallpaper : null;
  const label = mode === 'week' ? 'WALLPAPER OF THE WEEK' : mode === 'new' ? 'NEWLY ADDED' : subtitle;

  return (
    <section className="relative mb-10 md:mb-14 overflow-visible">
      <div className="relative min-h-[100px] md:min-h-[160px] flex items-end">
        <AnimatePresence mode="wait">
          {mode === 'brand' ? (
            <motion.h1
              key="brand"
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-end leading-[0.9] uppercase select-none"
            >
              <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-white">VELO</span>
              <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-zinc-500">CITY</span>
            </motion.h1>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-end gap-5 md:gap-8 w-full"
            >
              <Link
                to={`/brand/${brandToUrl(active!.brand)}/${active!.slug}`}
                className="relative w-[84px] h-[112px] md:w-[140px] md:h-[180px] shrink-0 overflow-hidden border border-white/15 group"
              >
                <img
                  src={active!.imageUrl}
                  alt={active!.title}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  loading="eager"
                  decoding="async"
                  // @ts-ignore — fetchpriority isn't in the TS DOM lib yet but is valid HTML
                  fetchpriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </Link>
              <div className="min-w-0">
                <p className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.88] text-white truncate">
                  {active!.title}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold mt-2">
                  {active!.brand} · {active!.category}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-5">
        <div className="h-px bg-zinc-900 flex-1" />
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] md:text-[12px] uppercase tracking-[0.45em] text-zinc-400 font-black whitespace-nowrap"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots — subtle hint that the hero is cycling, not broken */}
      <div className="flex gap-1.5 mt-4">
        {MODE_SEQUENCE.map((m, i) => (
          <span
            key={m}
            className={`h-[3px] rounded-full transition-all duration-500 ${
              i === modeIndex ? 'w-6 bg-white' : 'w-2 bg-zinc-800'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
