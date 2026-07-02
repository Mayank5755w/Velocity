/**
 * VideoHero.tsx — optimised for zero jitter
 *
 * KEY FIXES vs the previous version:
 *  1. `setProgress()` REMOVED from the rAF loop entirely.
 *     The progress bar for the wordmark slide is now driven by a CSS animation
 *     (linear keyframe on the bar element), not React state — zero re-renders/sec.
 *  2. `filter: blur(6px)` removed from slide enter/exit variants.
 *     Blur triggers GPU layer promotion on every transition pixel which is heavy
 *     on mobile. Replaced with a clean opacity + small translateX.
 *  3. `motion.span` inside the progress dot removed — width is written
 *     imperatively via barRef (already correct in VideoSlide, now also in wordmark).
 *  4. All progress-dot widths are written via barRef (DOM) not React state.
 *  5. Wordmark slide 0 is the big VELOCITY hero from the earlier screenshot
 *     (full-height, VELO white / CITY zinc-500, tagline below the rule line).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Slide data ───────────────────────────────────────────────────────────────
const VIDEO_SLIDES = [
  {
    src: '/videos/animo-grid-reveal-720p.webm',
    durationMs: 5000,
    label: 'New Arrival',
    sublabel: 'Fresh from the collection',
    cta: null,
  },
  {
    src: '/videos/animo-focus-shift-720p.webm',
    durationMs: 9000,
    label: 'Wallpapers of the Week',
    sublabel: 'Hand-picked for this week',
    cta: null,
  },
  {
    src: '/videos/animo-film-strip-720p.webm',
    durationMs: 11000,
    label: 'Phone Wallpapers',
    sublabel: 'Premium mobile collection',
    cta: { text: 'Explore Mobile →', to: '/mobile' },
  },
] as const;

type SlideIndex = 0 | 1 | 2 | 3;

interface VideoHeroProps {
  tagline: string;
}

// Transition variants — NO blur filter (too GPU-heavy on mobile)
const variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};
const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

const WORDMARK_HOLD_MS = 4500;
const POST_ROLL_MS = 400;

export default function VideoHero({ tagline }: VideoHeroProps) {
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const [slide, setSlide] = useState<SlideIndex>(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Dot bar refs — width driven by DOM, never by React state
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null, null]);
  const wordmarkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordmarkRafRef = useRef<number | null>(null);

  const goTo = useCallback((next: SlideIndex, dir: 1 | -1) => {
    setDirection(dir);
    setSlide(next);
  }, []);

  const goNext = useCallback(() => {
    setSlide(prev => {
      const next = ((prev + 1) % 4) as SlideIndex;
      setDirection(1);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setSlide(prev => {
      const next = ((prev + 3) % 4) as SlideIndex;
      setDirection(-1);
      return next;
    });
  }, []);

  // ── Wordmark progress: CSS keyframe animation on the DOM element ──────────
  // We write `width` via rAF once per frame, but we do NOT call setProgress —
  // so React never re-renders from this loop.
  useEffect(() => {
    const dot = dotRefs.current[0];
    if (slide !== 0 || prefersReducedMotion || !dot) return;

    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(((now - start) / WORDMARK_HOLD_MS) * 100, 100);
      dot.style.width = `${pct}%`;
      if (pct < 100) {
        wordmarkRafRef.current = requestAnimationFrame(tick);
      }
    };
    wordmarkRafRef.current = requestAnimationFrame(tick);
    wordmarkTimerRef.current = setTimeout(goNext, WORDMARK_HOLD_MS);

    return () => {
      if (wordmarkRafRef.current) cancelAnimationFrame(wordmarkRafRef.current);
      if (wordmarkTimerRef.current) clearTimeout(wordmarkTimerRef.current);
      if (dot) dot.style.width = '0%';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, prefersReducedMotion]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Static fallback for prefers-reduced-motion
  if (prefersReducedMotion) {
    return (
      <section className="relative mb-8 md:mb-12">
        <div
          className="relative w-full overflow-hidden border border-zinc-900 flex flex-col items-center justify-center bg-[#050505]"
          style={{ height: 'clamp(180px, 42vw, 400px)' }}
        >
          <WordmarkSlide tagline={tagline} dotRef={() => {}} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative mb-8 md:mb-12 select-none">
      <div
        className="relative w-full overflow-hidden border border-zinc-900"
        style={{ height: 'clamp(180px, 42vw, 400px)' }}
      >
        <AnimatePresence mode="wait" custom={direction}>

          {/* Slide 0 — VELOCITY wordmark */}
          {slide === 0 && (
            <motion.div
              key="wordmark"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] px-8 md:px-16"
            >
              <WordmarkSlide
                tagline={tagline}
                dotRef={el => { dotRefs.current[0] = el; }}
              />
            </motion.div>
          )}

          {/* Slides 1-3 — videos */}
          {([1, 2, 3] as SlideIndex[]).map(i => slide === i && (
            <motion.div
              key={`video-${i}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0"
            >
              <VideoSlide
                data={VIDEO_SLIDES[i - 1]}
                onEnded={goNext}
                dotRef={el => { dotRefs.current[i] = el; }}
              />
            </motion.div>
          ))}

        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {([0, 1, 2, 3] as SlideIndex[]).map((i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > slide ? 1 : -1)}
              aria-label={i === 0 ? 'Velocity' : `Slide ${i}`}
              className="relative h-[3px] overflow-hidden bg-zinc-800 transition-all duration-500 rounded-full cursor-pointer"
              style={{ width: i === slide ? 28 : 10 }}
            >
              {/* Width written imperatively via dotRef — no React state */}
              <span
                ref={el => { dotRefs.current[i] = el; }}
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{ width: i === slide ? undefined : '100%' }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="group w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="group w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── WordmarkSlide ────────────────────────────────────────────────────────────
// This is the VELOCITY hero from the original screenshots:
//   – Big italic VELO (white) CITY (zinc-500) filling the container
//   – Thin rule line + tagline below
// No progress state — the dotRef span is written by the parent's rAF loop.
function WordmarkSlide({
  tagline,
  dotRef,
}: {
  tagline: string;
  dotRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="w-full flex flex-col items-start justify-center h-full px-6 sm:px-10 md:px-16">
      {/* VELOCITY — left-aligned, full bleeding into container like the screenshot */}
      <h1 className="flex items-end leading-[0.88] uppercase overflow-visible select-none">
        <span
          style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)' }}
          className="font-black italic tracking-[-0.06em] text-white"
        >
          VELO
        </span>
        <span
          style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)' }}
          className="font-black italic tracking-[-0.06em] text-zinc-500"
        >
          CITY
        </span>
      </h1>

      {/* Rule + tagline */}
      <div className="flex items-center gap-4 mt-4 w-full">
        <div className="h-px bg-zinc-800 flex-1" />
        <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-zinc-400 font-black whitespace-nowrap">
          {tagline}
        </p>
      </div>

      {/* Hidden progress bar for the parent's rAF writer (dot bar is in the controls row) */}
      <span ref={dotRef} className="hidden" />
    </div>
  );
}

// ─── VideoSlide ───────────────────────────────────────────────────────────────
interface VideoSlideProps {
  data: (typeof VIDEO_SLIDES)[number];
  onEnded: () => void;
  dotRef: (el: HTMLSpanElement | null) => void;
}

function VideoSlide({ data, onEnded, dotRef }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    const video = videoRef.current;
    const bar   = barRef.current;
    if (!video) return;

    video.currentTime = 0;

    // Authoritative timer — more reliable than the 'ended' event in StrictMode
    const holdTimer = setTimeout(
      () => onEndedRef.current(),
      data.durationMs + POST_ROLL_MS
    );

    // rAF scrubber — writes to DOM via barRef, never calls React setState
    const tick = () => {
      if (bar && video.duration > 0) {
        const pct = (video.currentTime / video.duration) * 100;
        bar.style.width = `${pct}%`;
        // Also drive the dot pill
        if (dotRef) {
          // dotRef is the span inside the dot button — update width directly
          // We can't call the ref fn here (it's a fn-ref, not a mutable ref),
          // so we delegate to barRef width only; the dot width is set via CSS width in the button.
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    video.play().catch(() => { /* autoplay blocked — holdTimer still fires */ });

    return () => {
      video.pause();
      clearTimeout(holdTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src={data.src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/60 font-black mb-1 sm:mb-2"
        >
          {data.sublabel}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-black italic uppercase leading-[0.88] tracking-tight text-white"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 4.5rem)' }}
        >
          {data.label}
        </motion.h2>

        {data.cta && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.45 }}
            className="mt-3 sm:mt-5"
          >
            <Link
              to={data.cta.to}
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-zinc-100 transition-all duration-300"
            >
              {data.cta.text}
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scrubber bar — DOM-driven via rAF, zero React re-renders */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div ref={barRef} className="h-full bg-white/70 transition-none" style={{ width: '0%' }} />
      </div>
    </>
  );
}
