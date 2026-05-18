import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CAR_WALLPAPERS } from '../constants';
import Footer from '../Footer';

export default function WallpaperPage() {
  const { brand, slug } = useParams();

  const car = CAR_WALLPAPERS.find(
    (w) =>
      w.brand.toLowerCase() === brand &&
      w.slug === slug
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const relatedWallpapers = useMemo(() => {
    if (!car) return [];
    return CAR_WALLPAPERS
      .filter((w) => w.id !== car.id)
      .sort((a, b) => {
        const scoreA =
          (a.brand === car.brand ? 3 : 0) +
          (a.category === car.category ? 2 : 0) +
          Math.random();
        const scoreB =
          (b.brand === car.brand ? 3 : 0) +
          (b.category === car.category ? 2 : 0) +
          Math.random();
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [car]);

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">Wallpaper Not Found</h1>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-widest"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── HERO: Image LEFT + Info RIGHT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] lg:min-h-[80vh] border-b border-zinc-800">

        {/* IMAGE */}
        <div className="relative overflow-hidden bg-black" style={{ minHeight: '300px' }}>
          <Link to="/" className="absolute top-8 left-8 z-50 group">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>
          <img
            src={car.imageUrl || car.image}
            alt={car.title}
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '300px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* INFO PANEL */}
        <div className="bg-[#050505] border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col justify-between p-8 md:p-10">

          <div>
            {/* Badge + Title + Brand */}
            <span className="inline-block border border-white px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">
              {car.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tight mb-3">
              {car.title}
            </h1>
            <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 mb-8">
              {car.brand}
            </p>

            {/* About */}
            <div className="border-t border-zinc-800 pt-6 mb-5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">ABOUT</p>
              <p className="text-sm leading-6 text-zinc-300">
                {car.brand} delivers cutting-edge engineering blended with premium automotive craftsmanship.
              </p>
            </div>

            {/* Heritage */}
            <div className="border-t border-zinc-800 pt-5 mb-5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">HERITAGE</p>
              <p className="text-sm leading-6 text-zinc-300">
                {car.brand} has built a strong reputation through innovation, performance, and iconic vehicle design.
              </p>
            </div>

            {/* Details */}
            <div className="border-t border-zinc-800 pt-5">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">DETAILS</p>
              <ul className="space-y-2">
                {[
                  `Category: ${car.category}`,
                  `Brand: ${car.brand}`,
                  'Premium wallpaper collection',
                  '4K Ultra HD resolution',
                ].map((fact) => (
                  <li key={fact} className="flex items-start gap-2">
                    <span className="text-zinc-600 font-black text-[10px] mt-0.5 shrink-0">✦</span>
                    <span className="text-[11px] text-zinc-400 font-medium leading-snug">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 mt-8">
            <a
              href={car.imageUrl || car.image}
              download
              className="block w-full bg-white text-black text-center py-4 font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300"
            >
              INITIATE DOWNLOAD
            </a>
            <Link
              to="/"
              className="block w-full border border-zinc-800 text-center py-4 font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              RETURN TO GRID
            </Link>
          </div>
        </div>
      </div>

      {/* ── YOU MAY ALSO LIKE — always below, full width ── */}
      <section className="border-t border-zinc-900 px-4 md:px-10 py-10 md:py-16 bg-[#050505]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tight">
            You May Also Like
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Curated Recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {relatedWallpapers.map((wallpaper) => (
            <Link
              key={wallpaper.id}
              to={`/brand/${wallpaper.brand.toLowerCase()}/${wallpaper.slug}`}
              className="group border border-zinc-900 bg-zinc-950 overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                  {wallpaper.brand}
                </p>
                <h3 className="text-lg font-black italic uppercase leading-none">
                  {wallpaper.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
