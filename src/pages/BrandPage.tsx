import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CAR_WALLPAPERS, CATEGORIES } from '../constants';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Gauge, Heart, X } from 'lucide-react';
import { findBrandBySlug, brandToUrl, categoryToUrl } from '../utils';

export default function BrandPage() {
  const { brand: brandSlug } = useParams<{ brand: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('velocity_favorites') || '[]'); } catch { return []; }
  });

  const allBrandNames = useMemo(() => [...new Set(CAR_WALLPAPERS.map(w => w.brand))], []);
  const brandName = findBrandBySlug(brandSlug, allBrandNames);

  const wallpapers = useMemo(() => {
    if (!brandName) return [];
    return CAR_WALLPAPERS.filter(car => {
      const matchesBrand = car.brand === brandName;
      const matchesSearch = !searchQuery || car.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [brandName, searchQuery]);

  const allBrands = useMemo(() => {
    const map: Record<string, number> = {};
    CAR_WALLPAPERS.forEach(car => { map[car.brand] = (map[car.brand] || 0) + 1; });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('velocity_favorites', JSON.stringify(next));
  };

  useSEO({
    title: brandName ? `${brandName} Wallpapers 4K | Velocity` : 'Brand Not Found | Velocity',
    description: brandName
      ? `Download ${wallpapers.length} premium ${brandName} car wallpapers in 4K Ultra HD. Browse the complete ${brandName} collection on Velocity — free to download.`
      : 'This brand could not be found.',
    ogUrl: `/brand/${brandSlug}`,
  });

  if (!brandName) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-4">404</p>
          <h1 className="text-4xl font-black italic uppercase mb-8 text-white">Brand Not Found</h1>
          <Link to="/" className="inline-block px-8 py-4 border border-white font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all duration-300">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div className="flex flex-1 min-w-0">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-20 hidden lg:flex flex-col items-center justify-between py-12 border-r border-zinc-900 shrink-0">
          <div className="flex flex-col gap-12 items-center">
            <Link to="/" className="w-10 h-10 bg-white rounded-sm flex items-center justify-center rotate-45 transform transition-transform hover:rotate-[225deg] duration-700">
              <Gauge className="w-6 h-6 text-black -rotate-45" />
            </Link>
            <div className="flex flex-col gap-8">
              {allBrands.slice(0, 5).map(([brand]) => (
                <Link key={brand} to={`/brand/${brandToUrl(brand)}`}
                  className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors ${brand === brandName ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                  {brand}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/" className="text-xl font-black italic text-zinc-500 hover:text-white transition-colors">V</Link>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="border-b border-zinc-900 px-4 md:px-10 py-5 flex items-center gap-4">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-white flex items-center justify-center rotate-45">
                <Gauge className="w-3.5 h-3.5 text-black -rotate-45" />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 flex-wrap flex-1">
              <Link to="/" className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-800 text-zinc-300 hover:border-white/40 hover:text-white transition-all">All</Link>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <Link key={cat} to={`/category/${categoryToUrl(cat)}`}
                  className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-800 text-zinc-300 hover:border-white/40 hover:text-white transition-all">
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="relative group flex-1 md:flex-initial md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-white transition-colors" />
              <input type="text"
                placeholder={`Search ${brandName}...`}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-white py-3 pl-11 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none transition-all placeholder:text-zinc-500 text-white" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-zinc-400 hover:text-white transition-colors cursor-pointer" />
                </button>
              )}
            </div>

            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors hidden sm:block whitespace-nowrap">
              ← All
            </Link>
          </header>

          {/* HERO */}
          <section className="px-4 md:px-10 pt-10 pb-8">
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-3 font-bold">Brand Collection</p>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.88] tracking-tight text-white">
              {brandName}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-px bg-zinc-900 flex-1" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-300 font-bold">
                {wallpapers.length} wallpaper{wallpapers.length !== 1 ? 's' : ''} · Velocity Curated
              </p>
            </div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-200">{brandName}</span>
            </nav>
          </section>

          {/* Grid */}
          <main className="flex-1 px-4 md:px-10 pb-10">
            {wallpapers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">No Results</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {wallpapers.map(car => (
                  <Link key={car.id} to={`/brand/${brandToUrl(car.brand)}/${car.slug}`}
                    className="group relative border border-zinc-900 hover:border-white/30 bg-zinc-950 overflow-hidden transition-all duration-500 block">
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                        <img src={car.imageUrl} alt={`${car.title} 4K wallpaper`} loading="lazy"
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <button onClick={e => toggleFavorite(e, car.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${favorites.includes(car.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-black/40 border-white/20 text-zinc-400 hover:border-white/50 hover:text-white'}`}>
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                        </button>
                        <span className="absolute top-3 left-3 border border-white px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em]">{car.category}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">{car.category}</p>
                        <h2 className="text-lg font-black italic uppercase leading-none tracking-tight text-white">{car.title}</h2>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Other brands */}
          <section className="border-t border-zinc-900 px-4 md:px-10 py-8 bg-zinc-950">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-4 font-bold">Browse Other Brands</p>
            <div className="flex flex-wrap gap-3">
              {allBrands.filter(([b]) => b !== brandName).map(([brand, count]) => (
                <Link key={brand} to={`/brand/${brandToUrl(brand)}`}
                  className="flex items-center gap-2 px-4 py-3 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 hover:border-white hover:text-white transition-all duration-200">
                  <span>{brand}</span>
                  <span className="text-zinc-100 tabular-nums">{count}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="w-56 hidden xl:flex flex-col py-10 px-6 border-l border-zinc-900 bg-[#050505] shrink-0">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 font-bold">THIS BRAND</p>
              <p className="text-5xl font-light leading-none tracking-tighter text-white">{wallpapers.length}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mt-2 font-bold">WALLPAPERS</p>
            </div>

            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 font-bold">TOTAL COLLECTION</p>
              <p className="text-5xl font-light leading-none tracking-tighter text-white">{CAR_WALLPAPERS.length}</p>
            </div>

            {/* Search */}
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 font-bold">SEARCH</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
                <input type="text"
                  placeholder={`Search ${brandName}...`}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-white py-2.5 pl-9 pr-3 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none transition-all placeholder:text-zinc-500 text-white" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-zinc-400 hover:text-white transition-colors cursor-pointer" />
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown */}
            <div>
              <button onClick={() => setBrandsOpen(prev => !prev)} className="w-full flex items-center justify-between group/brands cursor-pointer">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] group-hover/brands:text-white transition-colors">OTHER BRANDS</p>
                <motion.span animate={{ rotate: brandsOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="text-zinc-500 group-hover/brands:text-white transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {brandsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex flex-col gap-1 mt-4">
                      {allBrands.filter(([b]) => b !== brandName).map(([brand, count]) => (
                        <Link key={brand} to={`/brand/${brandToUrl(brand)}`}
                          className="flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-800 text-zinc-400 hover:border-white/50 hover:text-white transition-all">
                          <span>{brand}</span><span className="text-zinc-300 tabular-nums">{count}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-zinc-900">
            <p className="text-[11px] leading-relaxed text-zinc-400 font-medium tracking-tight">
              Velocity is a curated platform for high-quality automotive wallpapers.
            </p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}