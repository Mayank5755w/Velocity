import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, Gauge, Heart, User, LogOut, Smartphone, Monitor } from 'lucide-react';
import { CAR_WALLPAPERS, CATEGORIES, PHONE_WALLPAPERS } from './constants';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useSEO } from './hooks/useSEO';

const collectionSize = CAR_WALLPAPERS.length;

function categoryToUrl(cat: string): string {
  return cat.toLowerCase().replace(/\s+/g, '-');
}

// 1. ADD PROPS TO ACCEPT THE ROUTE VIEW
interface AppProps {
  defaultView?: 'desktop' | 'mobile';
}

export default function App({ defaultView = 'desktop' }: AppProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('velocity_favorites') || '[]'); } catch { return []; }
  });

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [selectedPhoneBrand, setSelectedPhoneBrand] = useState<string | null>(null);
  const [phoneBrandsOpen, setPhoneBrandsOpen] = useState(false);

  // SEO Fallback
  useSEO({
    title: 'Velocity — Premium Automotive Wallpapers 4K',
    description: `Browse ${CAR_WALLPAPERS.length} premium 4K automotive wallpapers. Supercars, Hypercars, JDM, Luxury, Classic and Motor Sport. Free to download for desktop and mobile.`,
    ogUrl: '/',
  });

  useEffect(() => {
    localStorage.setItem('velocity_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Reset filters when swapping between desktop and mobile routes
  useEffect(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand(null);
    setSelectedPhoneBrand(null);
  }, [defaultView]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setUser({ name: 'Velocity Enthusiast', email: 'user@example.com', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=velocity' });
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => setUser(null);

  const brands = useMemo(() => {
    const map: Record<string, number> = {};
    CAR_WALLPAPERS.forEach(car => { map[car.brand] = (map[car.brand] || 0) + 1; });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const phoneBrands = useMemo(() => {
    const map: Record<string, number> = {};
    PHONE_WALLPAPERS.forEach(w => {
      if (w.brand && w.brand !== 'Mobile') map[w.brand] = (map[w.brand] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const filteredWallpapers = useMemo(() => {
    return CAR_WALLPAPERS.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) || car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Favorites'
        ? favorites.includes(car.id)
        : selectedCategory === 'All' || car.category === selectedCategory;
      const matchesBrand = !selectedBrand || car.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchQuery, selectedCategory, favorites, selectedBrand]);

  const filteredPhoneWallpapers = useMemo(() => {
    return PHONE_WALLPAPERS.filter(w => {
      const matchesSearch = !searchQuery || w.title.toLowerCase().includes(searchQuery.toLowerCase()) || (w.brand && w.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBrand = !selectedPhoneBrand || w.brand === selectedPhoneBrand;
      return matchesSearch && matchesBrand;
    });
  }, [searchQuery, selectedPhoneBrand]);

  const filterBtn = (active: boolean) =>
    `px-3 md:px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${active ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-zinc-800 hover:border-white/40 hover:text-white'}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div className="flex flex-1 min-w-0">

        {/* ── HAMBURGER (mobile) ── */}
        <button onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-black/80 border border-white/10 w-10 h-10 flex items-center justify-center text-xl backdrop-blur-md">☰</button>

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-20 hidden lg:flex flex-col items-center justify-between py-12 border-r border-zinc-900 shrink-0">
          <div className="flex flex-col gap-12 items-center">
            <Link to="/" className="w-10 h-10 bg-white rounded-sm flex items-center justify-center rotate-45 transform transition-transform hover:rotate-[225deg] duration-700">
              <Gauge className="w-6 h-6 text-black -rotate-45" />
            </Link>
            <div className="flex flex-col gap-8">
              {/* 2. CONVERTED TO REAL LINKS FOR SEO */}
              <Link to="/desktop" onClick={() => setSelectedCategory('All')}
                className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${defaultView === 'desktop' && selectedCategory !== 'Favorites' ? 'text-white' : 'text-white/30 hover:text-white'}`}>
                DESKTOP
              </Link>
              <Link to="/mobile"
                className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors ${defaultView === 'mobile' ? 'text-white' : 'text-white/30 hover:text-white'}`}>
                MOBILE
              </Link>
              <Link to="/desktop" onClick={() => setSelectedCategory('Favorites')}
                className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${selectedCategory === 'Favorites' && defaultView === 'desktop' ? 'text-white' : 'text-white/30 hover:text-white'}`}>
                SAVED ({favorites.length})
              </Link>
            </div>
          </div>
          <div className="text-xl font-black italic text-white/30">V</div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="border-b border-zinc-900">
            <div className="px-4 md:px-12 pt-4 md:pt-6 flex items-center gap-3">
              <div className="w-12 lg:hidden shrink-0" />

              {/* Desktop / Mobile toggle */}
              <div className="flex items-center border border-zinc-900 shrink-0 bg-[#050505]">
                {/* 3. HEADER TOGGLES CONVERTED TO LINKS */}
                <Link to="/desktop"
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${defaultView === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
                  <Monitor className="w-4 h-4" /><span>Desktop</span>
                </Link>
                <div className="w-px h-6 bg-zinc-900" />
                <Link to="/mobile"
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${defaultView === 'mobile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
                  <Smartphone className="w-4 h-4" /><span>Mobile</span>
                </Link>
              </div>

              {/* Search (md+) */}
              <div className="hidden md:flex flex-1 relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                <input type="text"
                  placeholder={defaultView === 'mobile' ? 'SEARCH MOBILE...' : 'SEARCH ALL MODELS...'}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 py-3 pl-11 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-white transition-all w-full" />
              </div>
            </div>

            {/* Search (mobile) */}
            <div className="px-4 pt-3 pb-4 md:hidden">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                <input type="text"
                  placeholder={defaultView === 'mobile' ? 'SEARCH MOBILE...' : 'SEARCH ALL MODELS...'}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 py-3 pl-11 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-white transition-all" />
              </div>
            </div>
            <div className="hidden md:block pb-6" />
          </header>

          <main className="flex-1 bg-[#050505] p-4 md:p-12 overflow-y-auto">

            {/* ════ DESKTOP SECTION ════ */}
            {defaultView === 'desktop' && (
              <div>
                {/* HERO */}
                <section className="mb-10 md:mb-14 overflow-visible">
                  <h1 className="flex items-end leading-[0.9] uppercase select-none overflow-visible">
                    <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-white">VELO</span>
                    <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-zinc-700">CITY</span>
                  </h1>
                  <div className="flex items-center gap-4 mt-5">
                    <div className="h-px bg-zinc-900 flex-1" />
                    <p className="text-[10px] md:text-[12px] uppercase tracking-[0.45em] text-zinc-500 font-black whitespace-nowrap">PREMIUM AUTOMOTIVE REPOSITORY</p>
                  </div>
                </section>

                {/* Category filters */}
                <div className="flex gap-2 flex-wrap mb-6 md:mb-8">
                  <button onClick={() => { setSelectedCategory('All'); setSelectedBrand(null); }} className={filterBtn(selectedCategory === 'All')}>All</button>
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <Link key={cat} to={`/category/${categoryToUrl(cat)}`} className={filterBtn(false)}>{cat}</Link>
                  ))}
                  <button onClick={() => setSelectedCategory('Favorites')} className={filterBtn(selectedCategory === 'Favorites')}>
                    ♥ Saved ({favorites.length})
                  </button>
                </div>

                {filteredWallpapers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-white/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">No Results</p>
                    <p className="text-sm">Try a different search or filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredWallpapers.map(car => (
                      <Link key={car.id} to={`/brand/${car.brand.toLowerCase()}/${car.slug}`}
                        className="group relative border border-zinc-900 hover:border-white/30 bg-zinc-950 overflow-hidden transition-all duration-500 block">
                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                            <img src={car.imageUrl} alt={`${car.title} 4K wallpaper`} loading="lazy"
                              className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <button onClick={e => toggleFavorite(e, car.id)}
                              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${favorites.includes(car.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-black/40 border-white/10 text-white/40 hover:border-white/40 hover:text-white'}`}>
                              <Heart className={`w-3.5 h-3.5 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                            </button>
                            <span className="absolute top-3 left-3 border border-white px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em]">{car.category}</span>
                          </div>
                          <div className="p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">{car.brand}</p>
                            <h3 className="text-lg font-black italic uppercase leading-none tracking-tight">{car.title}</h3>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ PHONE SECTION ════ */}
            {defaultView === 'mobile' && (
              <div>
                {/* HERO — identical style to desktop */}
                <section className="mb-10 md:mb-14 overflow-visible">
                  <h1 className="flex items-end leading-[0.9] uppercase select-none overflow-visible">
                    <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-white">VELO</span>
                    <span className="text-6xl md:text-[10rem] font-black italic tracking-[-0.06em] text-zinc-700">CITY</span>
                  </h1>
                  <div className="flex items-center gap-4 mt-5">
                    <div className="h-px bg-zinc-900 flex-1" />
                    <p className="text-[10px] md:text-[12px] uppercase tracking-[0.45em] text-zinc-500 font-black whitespace-nowrap">PREMIUM MOBILE WALLPAPERS</p>
                  </div>
                </section>

                {/* Phone brand filter pills */}
                {phoneBrands.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6 md:mb-8">
                    <button onClick={() => setSelectedPhoneBrand(null)} className={filterBtn(!selectedPhoneBrand)}>All</button>
                    {phoneBrands.map(([brand, count]) => (
                      <button key={brand} onClick={() => setSelectedPhoneBrand(prev => prev === brand ? null : brand)}
                        className={filterBtn(selectedPhoneBrand === brand)}>
                        {brand} <span className="opacity-40 ml-1">{count}</span>
                      </button>
                    ))}
                    {selectedPhoneBrand && (
                      <button onClick={() => setSelectedPhoneBrand(null)} className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-white/40 transition-all">
                        <X className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>
                )}

                {filteredPhoneWallpapers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-white/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">No Results</p>
                    <p className="text-sm">Try a different search or filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                    {filteredPhoneWallpapers.map(w => (
                      <Link key={w.slug} to={`/mobile/${w.slug}`} className="group">
                        <div className="relative rounded-[1.5rem] overflow-hidden border border-zinc-800 group-hover:border-white/30 bg-black aspect-[9/19] transition-all duration-500">
                          <img src={w.imageUrl} alt={`${w.title} phone wallpaper`} loading="lazy"
                            className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" />
                          <div className="absolute inset-0 border-[4px] border-black rounded-[1.5rem] pointer-events-none" />
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-10" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white border border-white/40 px-2 py-1">VIEW</span>
                          </div>
                        </div>
                        <p className="text-[9px] md:text-[10px] font-black italic uppercase tracking-tight text-white/60 group-hover:text-white transition-colors mt-2 leading-tight truncate px-0.5">{w.title}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="w-56 hidden xl:flex flex-col py-10 px-6 border-l border-zinc-900 bg-[#050505] shrink-0">
          <div className="mb-10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white truncate">{user.name}</p>
                    <p className="text-[8px] text-white/30 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                  <LogOut className="w-3 h-3" /> SIGN OUT
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} disabled={isLoggingIn}
                className="flex items-center gap-2 px-4 py-2.5 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white transition-all w-full justify-center">
                {isLoggingIn ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Gauge className="w-4 h-4" /></motion.div>
                ) : <User className="w-4 h-4" />}
                {isLoggingIn ? 'CONNECTING...' : 'SIGN IN'}
              </button>
            )}
          </div>

          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">DESKTOP WALLPAPERS</p>
              <p className="text-5xl font-light leading-none tracking-tighter">{collectionSize}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">MOBILE WALLPAPERS</p>
              <p className="text-5xl font-light leading-none tracking-tighter">{PHONE_WALLPAPERS.length}</p>
            </div>

            {/* Desktop brand dropdown */}
            {defaultView === 'desktop' && (
              <div>
                <button onClick={() => setBrandsOpen(prev => !prev)} className="w-full flex items-center justify-between group/brands">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover/brands:text-white/60 transition-colors">BROWSE BY BRAND</p>
                  <motion.span animate={{ rotate: brandsOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="text-white/30 group-hover/brands:text-white/60 transition-colors">
                    <ChevronRight className="w-3 h-3" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {brandsOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 mt-4">
                        {brands.map(([brand, count]) => (
                          <Link key={brand} to={`/brand/${brand.toLowerCase()}`}
                            className="flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-800 text-white/40 hover:border-white/30 hover:text-white transition-all">
                            <span>{brand}</span><span className="opacity-40 tabular-nums">{count}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Phone brand dropdown */}
            {defaultView === 'mobile' && phoneBrands.length > 0 && (
              <div>
                <button onClick={() => setPhoneBrandsOpen(prev => !prev)} className="w-full flex items-center justify-between group/pb">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover/pb:text-white/60 transition-colors">BROWSE BY BRAND</p>
                  <motion.span animate={{ rotate: phoneBrandsOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="text-white/30 group-hover/pb:text-white/60 transition-colors">
                    <ChevronRight className="w-3 h-3" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {phoneBrandsOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 mt-4">
                        {phoneBrands.map(([brand, count]) => (
                          <button key={brand} onClick={() => setSelectedPhoneBrand(prev => prev === brand ? null : brand)}
                            className={`flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${selectedPhoneBrand === brand ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-zinc-800 hover:border-white/30 hover:text-white'}`}>
                            <span>{brand}</span><span className="opacity-40 tabular-nums">{count}</span>
                          </button>
                        ))}
                        {selectedPhoneBrand && (
                          <button onClick={() => setSelectedPhoneBrand(null)}
                            className="mt-2 flex items-center justify-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/50 transition-all">
                            <X className="w-3 h-3" />CLEAR
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mt-auto pt-12 border-t border-zinc-900">
            <p className="text-[11px] leading-relaxed text-white/30 font-medium tracking-tight">
              Velocity is a curated platform for high-quality automotive wallpapers. Discover and explore a refined collection built for enthusiasts.
            </p>
          </div>
        </aside>

        {/* ── MOBILE FILTER DRAWER ── */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 h-full bg-black border-r border-white/10 p-6 overflow-y-auto">
              <button onClick={() => setMobileMenuOpen(false)} className="text-white text-3xl mb-8">✕</button>

              <div className="mb-8">
                <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Collection</div>
                <div className="flex gap-2">
                  <Link to="/desktop" onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${defaultView === 'desktop' ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:bg-white/10'}`}>
                    <Monitor className="w-4 h-4" /> Desktop
                  </Link>
                  <Link to="/mobile" onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${defaultView === 'mobile' ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:bg-white/10'}`}>
                    <Smartphone className="w-4 h-4" /> Mobile
                  </Link>
                </div>
              </div>

              {defaultView === 'desktop' && (
                <>
                  <div className="mb-8">
                    <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Category</div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setSelectedCategory('All'); setMobileMenuOpen(false); }}
                        className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedCategory === 'All' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>All</button>
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <Link key={cat} to={`/category/${categoryToUrl(cat)}`} onClick={() => setMobileMenuOpen(false)}
                          className="w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm text-white hover:bg-white/10">{cat}</Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Brand</div>
                    <div className="flex flex-col gap-2">
                      {brands.map(([brand]) => (
                        <Link key={brand} to={`/brand/${brand.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                          className="w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm text-white hover:bg-white/10">{brand}</Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {defaultView === 'mobile' && phoneBrands.length > 0 && (
                <div>
                  <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Brand</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setSelectedPhoneBrand(null); setMobileMenuOpen(false); }}
                      className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${!selectedPhoneBrand ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>All Brands</button>
                    {phoneBrands.map(([brand]) => (
                      <button key={brand} onClick={() => { setSelectedPhoneBrand(brand); setMobileMenuOpen(false); }}
                        className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedPhoneBrand === brand ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>{brand}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}