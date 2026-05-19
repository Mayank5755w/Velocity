import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PHONE_WALLPAPERS } from '../constants';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';

export default function PhoneWallpaperPage() {
  const { slug } = useParams();

  const wallpaper = PHONE_WALLPAPERS.find(w => w.slug === slug);

  // SEO — unconditional
  useSEO({
    title: wallpaper
      ? `${wallpaper.title} Phone Wallpaper | Velocity`
      : 'Mobile Wallpaper Not Found | Velocity',
    description: wallpaper
      ? `Download the ${wallpaper.title} phone wallpaper for iOS and Android. Premium portrait ${wallpaper.category} wallpaper from Velocity's mobile collection.`
      : 'This mobile wallpaper could not be found.',
    ogImage: wallpaper?.imageUrl,
    ogUrl: wallpaper ? `/mobile/${wallpaper.slug}` : undefined,
    ogType: 'article',
  });

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Similar phone wallpapers (random, exclude current)
  const similar = useMemo(() => {
    return PHONE_WALLPAPERS
      .filter(w => w.slug !== slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [slug]);

  if (!wallpaper) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4">404</p>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase mb-8">Not Found</h1>
          <Link
            to="/mobile"
            className="inline-block px-8 py-4 border border-white font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all duration-300"
          >
            Return to Mobile Wallpapers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ── HERO SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] min-h-screen lg:min-h-0 lg:h-screen border-b border-zinc-900">

        {/* LEFT: Full bleed image with phone mockup overlay */}
        <div className="relative flex items-center justify-center bg-black overflow-hidden min-h-[70vw] sm:min-h-[60vw] lg:min-h-0">

          {/* Blurred background */}
          <div
            className="absolute inset-0 scale-110"
            style={{
              backgroundImage: `url(${wallpaper.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) brightness(0.25)',
            }}
          />

          {/* Back button */}
          <Link to="/mobile" className="absolute top-6 left-6 z-20 group">
            <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/50 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white group-hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>

          {/* Phone mockup */}
          <div className="relative z-10 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[240px] xl:w-[280px]">
            {/* Outer shell */}
            <div className="relative rounded-[3rem] overflow-hidden border-[3px] border-zinc-700 shadow-2xl shadow-black/80 aspect-[9/19] bg-black">
              <img
                src={wallpaper.imageUrl}
                alt={`${wallpaper.title} phone wallpaper`}
                className="w-full h-full object-cover"
              />
              {/* Inner bezel */}
              <div className="absolute inset-0 border-[6px] border-black rounded-[2.8rem] pointer-events-none" />
              {/* Dynamic island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-10" />
              {/* Screen shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-[2.8rem]" />
            </div>
            {/* Side button */}
            <div className="absolute -right-[5px] top-[22%] w-[4px] h-14 bg-zinc-700 rounded-full" />
            {/* Volume buttons */}
            <div className="absolute -left-[5px] top-[18%] w-[4px] h-8 bg-zinc-700 rounded-full" />
            <div className="absolute -left-[5px] top-[28%] w-[4px] h-12 bg-zinc-700 rounded-full" />
          </div>
        </div>

        {/* RIGHT: Info panel */}
        <div className="bg-[#050505] border-t lg:border-t-0 lg:border-l border-zinc-900 flex flex-col justify-between p-8 md:p-10">

          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/mobile" className="hover:text-white transition-colors">Mobile</Link>
              <span>/</span>
              <span className="text-zinc-400">{wallpaper.title}</span>
            </nav>

            <span className="inline-block border border-zinc-700 shadow-[0_0_40px_rgba(255,255,255,0.06)] px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-6">
              Mobile Wallpaper
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase leading-[0.88] tracking-tight mb-4">
              {wallpaper.title}
            </h1>

            <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500 mb-10">
              Velocity Mobile Collection
            </p>

            {/* Specs */}
            <div className="space-y-3 border-t border-zinc-900 pt-6">
              {[
                ['Format', 'Portrait 9:19'],
                ['Resolution', 'High Definition'],
                ['Category', wallpaper.category],
                ['Brand', wallpaper.brand],
                ['Collection', 'Velocity Mobile'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{label}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mt-8">
            <a
              href={wallpaper.imageUrl}
              download
              className="block w-full bg-white text-black text-center py-4 md:py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300"
            >
              ↓ SAVE WALLPAPER
            </a>
            <Link
              to="/mobile"
              className="block w-full border border-zinc-800 text-center py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all duration-300"
            >
              MORE MOBILE WALLPAPERS
            </Link>
            <Link
              to="/"
              className="block w-full border border-zinc-800 text-center py-3 font-black uppercase tracking-[0.2em] text-[9px] hover:bg-white hover:text-black transition-all duration-300"
            >
              RETURN TO GRID
            </Link>
          </div>
        </div>
      </div>

      

      {/* ── YOU MAY ALSO LIKE ── */}
      <section className="px-4 md:px-10 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2">More Mobile</p>
            <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight leading-none">
              You May Also Like
            </h2>
          </div>
          <Link
            to="/mobile"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors hidden sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {similar.map(w => (
            <Link
              key={w.slug}
              to={`/mobile/${w.slug}`}
              className="group"
            >
              {/* Phone frame */}
              <div className="relative rounded-[1.5rem] overflow-hidden border border-zinc-800 group-hover:border-white/30 bg-black aspect-[9/19] transition-all duration-500">
                <img
                  src={w.imageUrl}
                  alt={`${w.title} phone wallpaper`}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />
                {/* Bezel */}
                <div className="absolute inset-0 border-[4px] border-black rounded-[1.5rem] pointer-events-none" />
                {/* Dynamic island */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-10" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white border border-white/40 px-2 py-1">VIEW</span>
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] font-black italic uppercase tracking-tight text-white/60 group-hover:text-white transition-colors mt-2 leading-tight truncate px-0.5">
                {w.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
