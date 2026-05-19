import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CAR_WALLPAPERS } from '../constants';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';

export default function WallpaperPage() {
  const { brand, slug } = useParams();

  const car = CAR_WALLPAPERS.find(
    (w) => w.brand.toLowerCase() === brand && w.slug === slug
  );

  useSEO({
    title: car ? `${car.title} Wallpaper 4K | Velocity` : 'Wallpaper Not Found | Velocity',
    description: car
      ? `Download the ${car.title} 4K ultra HD desktop wallpaper. Premium ${car.category} automotive wallpaper from ${car.brand}, part of the Velocity curated collection.`
      : 'This wallpaper could not be found.',
    ogImage: car?.imageUrl,
    ogUrl: car ? `/brand/${car.brand.toLowerCase()}/${car.slug}` : undefined,
    ogType: 'article',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const relatedWallpapers = useMemo(() => {
    if (!car) return [];
    return CAR_WALLPAPERS
      .filter((w) => w.id !== car.id)
      .sort((a, b) => {
        const sA = (a.brand === car.brand ? 3 : 0) + (a.category === car.category ? 2 : 0) + Math.random();
        const sB = (b.brand === car.brand ? 3 : 0) + (b.category === car.category ? 2 : 0) + Math.random();
        return sB - sA;
      })
      .slice(0, 4);
  }, [car]);

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">Wallpaper Not Found</h1>
          <Link to="/" className="inline-block mt-6 px-6 py-3 border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-widest">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── HERO: responsive height, image top on mobile + panel right on desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-screen lg:h-screen border-b border-zinc-800 lg:overflow-hidden">

        {/* IMAGE — 55vh height on mobile, fills left column on desktop */}
        <div className="relative overflow-hidden bg-black min-h-[55vh] lg:min-h-0">
          <Link to="/" className="absolute top-8 left-8 z-50 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>
          <img
            src={car.imageUrl || (car as any).image}
            alt={`${car.title} 4K wallpaper`}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* INFO PANEL — flows naturally on mobile, scrollable inside fixed height on desktop */}
        <div className="bg-[#050505] border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col lg:h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Scrollable content */}
          <div className="flex-1 p-8 md:p-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to={`/brand/${car.brand.toLowerCase()}`} className="hover:text-white transition-colors">{car.brand}</Link>
              <span>/</span>
              <span className="text-zinc-400 truncate max-w-[120px]">{car.title}</span>
            </nav>

            <span className="inline-block border border-white px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              {car.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase leading-[0.9] tracking-tight mb-2">
              {car.title}
            </h1>
            <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 mb-6">
              {car.brand}
            </p>

            <div className="border-t border-zinc-800 pt-5 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">ABOUT</p>
              <p className="text-sm leading-6 text-zinc-300">
                {car.brand} delivers cutting-edge engineering blended with premium automotive craftsmanship.
              </p>
            </div>

            <div className="border-t border-zinc-800 pt-4 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">HERITAGE</p>
              <p className="text-sm leading-6 text-zinc-300">
                {car.brand} has built a strong reputation through innovation, performance, and iconic vehicle design.
              </p>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">DETAILS</p>
              <ul className="space-y-2">
                {[`Category: ${car.category}`, `Brand: ${car.brand}`, 'Premium wallpaper collection', '4K Ultra HD resolution'].map((fact) => (
                  <li key={fact} className="flex items-start gap-2">
                    <span className="text-zinc-600 font-black text-[10px] mt-0.5 shrink-0">✦</span>
                    <span className="text-[11px] text-zinc-400 font-medium leading-snug">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky action buttons pinned to bottom */}
          <div className="sticky bottom-0 bg-[#050505] border-t border-zinc-800 p-6 space-y-3">
            <a
              href={car.imageUrl || (car as any).image}
              download
              className="flex items-center justify-center gap-2 w-full bg-white text-black text-center py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300"
            >
              ↓ INITIATE DOWNLOAD
            </a>
            <Link
              to={`/brand/${car.brand.toLowerCase()}`}
              className="block w-full border border-zinc-800 text-center py-3.5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all duration-300"
            >
              MORE {car.brand.toUpperCase()} WALLPAPERS
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

      {/* ── YOU MAY ALSO LIKE ── full width below the fold */}
      <section className="bg-[#050505] px-4 md:px-10 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2">More {car.brand}</p>
            <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tight">You May Also Like</h2>
          </div>
          <Link to={`/brand/${car.brand.toLowerCase()}`} className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors hidden sm:block">
            View All {car.brand} →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedWallpapers.map((w) => (
            <Link key={w.id} to={`/brand/${w.brand.toLowerCase()}/${w.slug}`} className="group border border-zinc-900 bg-zinc-950 overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                <img src={w.imageUrl} alt={`${w.title} wallpaper`} loading="lazy"
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">{w.brand}</p>
                <h3 className="text-base font-black italic uppercase leading-tight">{w.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}