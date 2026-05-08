import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CAR_WALLPAPERS } from '../constants';

export default function WallpaperPage() {
  const { brand, slug } = useParams();

  const car = CAR_WALLPAPERS.find(
    (w) =>
      w.brand.toLowerCase() === brand &&
      w.slug === slug
  );

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4">
            Wallpaper Not Found
          </h1>

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
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}, [slug]);
  const relatedWallpapers = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] lg:h-[78vh] border-b border-zinc-800">

        {/* IMAGE SECTION */}
        <div className="relative h-full overflow-hidden">

          {/* PREMIUM BACK BUTTON */}
          <Link
            to="/"
            className="absolute top-8 left-8 z-50 group"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white shadow-2xl">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>

            </div>
          </Link>

          <img
            src={car.imageUrl || car.image}
            alt={car.title}
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* SIDEBAR */}
        <div className="bg-[#050505] border-l border-zinc-800 flex flex-col justify-between p-8">

          <div>
            <span className="inline-block border border-white px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase">
              {car.category}
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tight">
              {car.title}
            </h1>

            <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-zinc-500">
              {car.brand}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="space-y-4">
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

      {/* BOTTOM INFO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-black">

        {/* ABOUT */}
        <div className="p-6 border-r border-zinc-900">
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-4">
            About
          </p>

          <p className="text-sm leading-6 text-zinc-300">
            {car.brand} delivers cutting-edge engineering blended
            with premium automotive craftsmanship.
          </p>
        </div>

        {/* HERITAGE */}
        <div className="p-6 border-r border-zinc-900">
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-4">
            Heritage
          </p>

          <p className="text-sm leading-6 text-zinc-300">
            {car.brand} has built a strong reputation through
            innovation, performance, and iconic vehicle design.
          </p>
        </div>

        {/* DETAILS */}
        <div className="p-6">
          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600 mb-4">
            Details
          </p>

          <div className="space-y-3 text-sm text-zinc-300">
            <p>✦ Category: {car.category}</p>
            <p>✦ Brand: {car.brand}</p>
            <p>✦ Premium wallpaper collection</p>
          </div>
        </div>
      </div>
      <section className="border-t border-zinc-900 px-4 md:px-10 py-10 md:py-16">

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
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
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
    </div>
  );
}