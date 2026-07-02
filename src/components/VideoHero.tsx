import { useCallback, useEffect, useMemo, useRef, useState } from 'react'; // useState kept for slide/direction/progress in parent
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO FILE LOCATIONS — update paths + durationMs if you swap videos.
// durationMs = actual video length. Used as the authoritative hold time so we
// never depend solely on the 'ended' event (which can misfire in StrictMode).
// ─────────────────────────────────────────────────────────────────────────────
const VIDEO_SLIDES = [
  {
    src: '/videos/animo-grid-reveal-720p.webm',
    durationMs: 5000,   // "Newly Added" — 5 s
    label: 'New Arrival',
    sublabel: 'Fresh from the collection',
    cta: null,
  },
  {
    src: '/videos/animo-focus-shift-720p.webm',
    durationMs: 9000,   // "Wallpaper of the Week" — 9 s
    label: 'Wallpapers of the Week',
    sublabel: 'Hand-picked for this week',
    cta: null,
  },
  {
    src: '/videos/animo-film-strip-720p.webm',
    durationMs: 11000,  // "Phone Wallpapers" — 11 s
    label: 'Phone Wallpapers',
    sublabel: 'Premium mobile collection',
    cta: { text: 'Explore Mobile →', to: '/mobile' },
  },
] as const;

type SlideIndex = 0 | 1 | 2 | 3;

interface VideoHeroProps {
  tagline: string;
}

export default function VideoHero({ tagline }: VideoHeroProps) {
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const [slide, setSlide] = useState<SlideIndex>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progress, setProgress] = useState(0);
  const progressRafRef = useRef<number | null>(null);
  const wordmarkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const WORDMARK_HOLD_MS = 4500;

  const goTo = useCallback((next: SlideIndex, dir: 1 | -1) => {
    setDirection(dir);
    setSlide(next);
    setProgress(0);
  }, []);

  // These don't read `slide` from closure — they use the functional updater
  // so they're stable references that never get recreated on slide changes.
  const goNext = useCallback(() => {
    setSlide(prev => ((prev + 1) % 4) as SlideIndex);
    setDirection(1);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setSlide(prev => ((prev + 3) % 4) as SlideIndex);
    setDirection(-1);
    setProgress(0);
  }, []);

  // Wordmark hold — fills progress bar for 4.5s then advances
  useEffect(() => {
    if (slide !== 0 || prefersReducedMotion) return;

    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(((now - start) / WORDMARK_HOLD_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRafRef.current = requestAnimationFrame(tick);
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);
    wordmarkTimerRef.current = setTimeout(goNext, WORDMARK_HOLD_MS);

    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      if (wordmarkTimerRef.current) clearTimeout(wordmarkTimerRef.current);
    };
  // Only re-run when slide changes to 0, not when goNext changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  if (prefersReducedMotion) {
    return (
      <section className="relative mb-8 md:mb-12">
        <div className="relative w-full overflow-hidden border border-zinc-900 flex items-center justify-center bg-[#050505]"
          style={{ height: 'clamp(180px, 42vw, 400px)' }}>
          <WordmarkContent tagline={tagline} progress={100} />
        </div>
      </section>
    );
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48, filter: 'blur(6px)' }),
  };
  const transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section className="relative mb-8 md:mb-12 select-none">

      {/*
        Height: clamp(180px, 42vw, 400px)
        — on mobile (390px wide)  → 42vw = 164px → clamp gives 180px (min)
        — on tablet (768px wide)  → 42vw = 322px  
        — on desktop (1200px+)    → capped at 400px, never taller
        Videos use object-cover so they fill any height perfectly.
        All slides share the exact same box — zero size jump.
      */}
      <div className="relative w-full overflow-hidden border border-zinc-900"
        style={{ height: 'clamp(180px, 42vw, 400px)' }}>
        <AnimatePresence mode="wait" custom={direction}>

          {/* Slide 0 — VELOCITY wordmark, same 16:9 box */}
          {slide === 0 && (
            <motion.div key="wordmark" custom={direction}
              variants={variants} initial="enter" animate="center" exit="exit" transition={transition}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] px-8 md:px-16">
              <WordmarkContent tagline={tagline} progress={progress} />
            </motion.div>
          )}

          {/* Slides 1-3 — fill the same 16:9 container absolutely */}
          {slide === 1 && (
            <motion.div key="video-1" custom={direction}
              variants={variants} initial="enter" animate="center" exit="exit" transition={transition}
              className="absolute inset-0">
              <VideoSlide data={VIDEO_SLIDES[0]} onEnded={goNext} />
            </motion.div>
          )}

          {slide === 2 && (
            <motion.div key="video-2" custom={direction}
              variants={variants} initial="enter" animate="center" exit="exit" transition={transition}
              className="absolute inset-0">
              <VideoSlide data={VIDEO_SLIDES[1]} onEnded={goNext} />
            </motion.div>
          )}

          {slide === 3 && (
            <motion.div key="video-3" custom={direction}
              variants={variants} initial="enter" animate="center" exit="exit" transition={transition}
              className="absolute inset-0">
              <VideoSlide data={VIDEO_SLIDES[2]} onEnded={goNext} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom row: dots + prev/next */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          {([0, 1, 2, 3] as SlideIndex[]).map((i) => (
            <button key={i} onClick={() => goTo(i, i > slide ? 1 : -1)}
              aria-label={i === 0 ? 'Velocity' : `Slide ${i}`}
              className="relative h-[3px] overflow-hidden bg-zinc-800 transition-all duration-500 rounded-full"
              style={{ width: i === slide ? 28 : 10 }}>
              {i === slide && (
                <motion.span className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ width: slide === 0 ? `${progress}%` : '100%' }} />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={goPrev} aria-label="Previous slide"
            className="group w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-all duration-200 cursor-pointer">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </button>
          <button onClick={goNext} aria-label="Next slide"
            className="group w-9 h-9 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-all duration-200 cursor-pointer">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VideoSlide
// Each slide is its own component instance with its own internal ref and state.
// onEnded is stored in a ref so the effect never needs to re-run if the
// parent recreates the callback — the video plays to natural completion only.
// ─────────────────────────────────────────────────────────────────────────────
interface VideoSlideProps {
  data: typeof VIDEO_SLIDES[number];
  onEnded: () => void;
}

// A small pause (ms) added after the video's natural end before transitioning.
// Lets the last frame breathe instead of cutting straight to the exit animation.
const POST_ROLL_MS = 400;

function VideoSlide({ data, onEnded }: VideoSlideProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number | null>(null);

  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    const video = videoRef.current;
    const bar   = barRef.current;
    if (!video) return;

    video.currentTime = 0;

    // ── Authoritative hold timer ──────────────────────────────────────────────
    // We trust the known durationMs rather than solely the 'ended' event.
    // In React StrictMode dev mode, double-mounting can cause 'ended' to fire
    // immediately on remount. Using a timer keyed to the real duration sidesteps
    // that entirely. POST_ROLL_MS lets the last frame linger before transition.
    const holdTimer = setTimeout(
      () => onEndedRef.current(),
      data.durationMs + POST_ROLL_MS
    );

    // ── Smooth 60 fps scrubber ────────────────────────────────────────────────
    // Direct DOM write via barRef — zero React re-renders, zero jitter.
    const tick = () => {
      if (bar && video.duration > 0) {
        bar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // ── Play ──────────────────────────────────────────────────────────────────
    video.play().catch(() => {
      // Autoplay blocked — holdTimer still fires so we won't get stuck.
    });

    return () => {
      video.pause();
      clearTimeout(holdTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // runs exactly once per mount — intentional.

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

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Text — padding and sizes tuned for the clamped-height container */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/60 font-black mb-1 sm:mb-2">
          {data.sublabel}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="font-black italic uppercase leading-[0.88] tracking-tight text-white"
          style={{ fontSize: 'clamp(1.4rem, 5vw, 4.5rem)' }}>
          {data.label}
        </motion.h2>

        {data.cta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }} className="mt-3 sm:mt-5">
            <Link to={data.cta.to}
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-zinc-100 transition-all duration-300">
              {data.cta.text}
            </Link>
          </motion.div>
        )}
      </div>

      {/* Playback scrubber — width driven by rAF via barRef, not React state */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div ref={barRef} className="h-full bg-white/70" style={{ width: '0%' }} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WordmarkContent
// ─────────────────────────────────────────────────────────────────────────────
function WordmarkContent({ tagline, progress }: { tagline: string; progress: number }) {
  return (
    <div className="w-full text-center px-4 sm:px-8">
      {/* Font scales with viewport width, capped so it never overflows the smaller box */}
      <h1 className="flex items-end justify-center leading-[0.88] uppercase overflow-visible">
        <span style={{ fontSize: 'clamp(3rem, 13vw, 10rem)' }}
          className="font-black italic tracking-[-0.06em] text-white">VELO</span>
        <span style={{ fontSize: 'clamp(3rem, 13vw, 10rem)' }}
          className="font-black italic tracking-[-0.06em] text-zinc-500">CITY</span>
      </h1>
      <div className="flex items-center gap-3 mt-3 sm:mt-5">
        <div className="relative h-px flex-1 bg-zinc-900 overflow-hidden">
          <motion.span className="absolute inset-y-0 left-0 bg-zinc-600" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-zinc-400 font-black whitespace-nowrap">
          {tagline}
        </p>
      </div>
    </div>
  );
}
