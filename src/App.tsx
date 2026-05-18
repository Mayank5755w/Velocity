import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, X, ChevronRight, Gauge, Heart, User, LogOut, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { CAR_WALLPAPERS, CATEGORIES, PHONE_WALLPAPERS, CarWallpaper } from './constants';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const collectionSize = CAR_WALLPAPERS.length;

interface CarInfo {
  about: string;
  history: string;
  facts: string[];
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<CarWallpaper | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [activeSection, setActiveSection] = useState<'desktop' | 'phone'>('desktop');

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('velocity_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Desktop brand filter
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandsOpen, setBrandsOpen] = useState(false);

  // Phone brand filter
  const [selectedPhoneBrand, setSelectedPhoneBrand] = useState<string | null>(null);
  const [phoneBrandsOpen, setPhoneBrandsOpen] = useState(false);

  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [carInfoLoading, setCarInfoLoading] = useState(false);
  const [similarCars, setSimilarCars] = useState<CarWallpaper[]>([]);

  useEffect(() => {
    localStorage.setItem('velocity_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand(null);
    setSelectedPhoneBrand(null);
  }, [activeSection]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
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

  const handleDownload = async (car: CarWallpaper) => {
    setIsDownloading(true);
    try {
      const response = await fetch(car.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${car.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(car.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Desktop brands — alphabetical
  const brands = useMemo(() => {
    const map: Record<string, number> = {};
    CAR_WALLPAPERS.forEach(car => { map[car.brand] = (map[car.brand] || 0) + 1; });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  // Phone brands — alphabetical, exclude 'Mobile'
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
      let matchesCategory = false;
      if (selectedCategory === 'Favorites') {
        matchesCategory = favorites.includes(car.id);
      } else {
        matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
      }
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

  const computeSimilarCars = useCallback((car: CarWallpaper) => {
    const others = CAR_WALLPAPERS.filter(c => c.id !== car.id);
    const scored = others.map(c => ({ car: c, score: (c.category === car.category ? 3 : 0) + (c.brand === car.brand ? 2 : 0) + Math.random() }));
    scored.sort((a, b) => b.score - a.score);
    setSimilarCars(scored.slice(0, 4).map(s => s.car));
  }, []);

  const fetchCarInfo = useCallback((car: CarWallpaper) => {
    setCarInfoLoading(true);
    setTimeout(() => {
      setCarInfo({
        about: `${car.brand} delivers cutting-edge engineering blended with premium automotive craftsmanship.`,
        history: `${car.brand} has built a strong reputation in the automotive world through innovation, performance, and iconic vehicle design.`,
        facts: [`4K Ultra HD resolution wallpaper`, `Category: ${car.category}`, `Brand: ${car.brand}`, 'Part of the Velocity curated collection'],
      });
      setCarInfoLoading(false);
    }, 400);
  }, []);

  const openModal = useCallback((car: CarWallpaper) => {
    setSelectedWallpaper(car);
    setCarInfo(null);
    fetchCarInfo(car);
    computeSimilarCars(car);
  }, [fetchCarInfo, computeSimilarCars]);

  // Shared filter button classes
  const filterBtn = (active: boolean) =>
    `px-3 md:px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${active ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-brand-line hover:border-white/40 hover:text-white'}`;

  return (
  <div className="min-h-screen bg-brand-dark flex flex-col">
    <div className="flex flex-1 min-w-0">

      {/* ── HAMBURGER (mobile only) ── */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-black/80 border border-white/10 w-10 h-10 flex items-center justify-center text-xl backdrop-blur-md"
      >☰</button>

      {/* ── LEFT SIDEBAR (desktop only) ── */}
      <aside className="w-20 hidden lg:flex flex-col items-center justify-between py-12 border-r border-brand-line shrink-0">
        <div className="flex flex-col gap-12 items-center">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center rotate-45 transform transition-transform hover:rotate-225 duration-700">
            <Gauge className="w-6 h-6 text-black -rotate-45" />
          </div>
          <div className="flex flex-col gap-8">
            <div onClick={() => { setActiveSection('desktop'); setSelectedCategory('All'); }} className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${activeSection === 'desktop' ? 'text-white' : 'text-white/30 hover:text-white'}`}>DESKTOP</div>
            <div onClick={() => setActiveSection('phone')} className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${activeSection === 'phone' ? 'text-white' : 'text-white/30 hover:text-white'}`}>MOBILE</div>
            <div onClick={() => { setActiveSection('desktop'); setSelectedCategory('Favorites'); }} className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${selectedCategory === 'Favorites' && activeSection === 'desktop' ? 'text-white' : 'text-white/30 hover:text-white'}`}>SAVED ({favorites.length})</div>
          </div>
        </div>
        <div className="text-xl font-black italic">V</div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── HEADER ── */}
        <header className="border-b border-brand-line">

          {/* Row 1: section toggle (always) */}
          <div className="px-4 md:px-12 pt-4 md:pt-6 flex items-center gap-3">
            {/* Spacer for hamburger on mobile */}
            <div className="w-12 lg:hidden shrink-0" />

            <div className="flex items-center border border-brand-line shrink-0 bg-[#050505]">
              <button
                onClick={() => setActiveSection('desktop')}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                <Monitor className="w-4 h-4" /><span>Desktop</span>
              </button>
              <div className="w-px h-6 bg-brand-line" />
              <button
                onClick={() => setActiveSection('phone')}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === 'phone' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                <Smartphone className="w-4 h-4" /><span>Mobile</span>
              </button>
            </div>

            {/* Search: hidden on mobile (shown in row 2), visible on md+ */}
            <div className="hidden md:flex flex-1 relative group max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder={activeSection === 'phone' ? 'SEARCH MOBILE...' : 'SEARCH ALL MODELS...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-brand-medium border border-brand-line rounded-none py-3 pl-11 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-white transition-all w-full"
              />
            </div>
          </div>

          {/* Row 2: search bar — mobile only, full width below toggle */}
          <div className="px-4 pt-3 pb-4 md:hidden">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder={activeSection === 'phone' ? 'SEARCH MOBILE...' : 'SEARCH ALL MODELS...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-brand-medium border border-brand-line rounded-none py-3 pl-11 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-white transition-all"
              />
            </div>
          </div>

          {/* Desktop: bottom padding to close header row 1 */}
          <div className="hidden md:block pb-6" />
        </header>

        <main className="flex-1 bg-brand-dark p-4 md:p-12 overflow-y-auto">

          {/* ════════════════════════════════════════
              DESKTOP SECTION
          ════════════════════════════════════════ */}
          {activeSection === 'desktop' && (
            <div>
              {/* Category filter row */}
              <div className="flex gap-2 flex-wrap mb-6 md:mb-8">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={filterBtn(selectedCategory === cat)}>
                    {cat}
                  </button>
                ))}
              </div>

              {filteredWallpapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-white/20">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">No Results</p>
                  <p className="text-sm">Try a different search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredWallpapers.map(car => (
                    <motion.div
                      key={car.id}
                      layoutId={car.id}
                      onClick={() => openModal(car)}
                      className="group relative border border-brand-line hover:border-white/30 bg-brand-medium overflow-hidden cursor-pointer transition-all duration-500"
                      whileHover={{ y: -2 }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                        <img
                          src={car.imageUrl}
                          alt={car.title}
                          loading="lazy"
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <button
                          onClick={e => toggleFavorite(e, car.id)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${favorites.includes(car.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-black/40 border-white/10 text-white/40 hover:border-white/40 hover:text-white'}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                        </button>
                        <span className="absolute top-3 left-3 badge text-[8px]">{car.category}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">{car.brand}</p>
                        <h3 className="text-lg font-display font-black italic uppercase leading-none tracking-tight">{car.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════
              PHONE / MOBILE SECTION
          ════════════════════════════════════════ */}
          {activeSection === 'phone' && (
            <div>
              {filteredPhoneWallpapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-white/20">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">No Results</p>
                  <p className="text-sm">Try a different search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
                  {filteredPhoneWallpapers.map(w => (
                    <Link
                      key={w.slug}
                      to={`/phone/${w.slug}`}
                      className="group"
                    >
                      <div className="relative rounded-[1.5rem] overflow-hidden border border-zinc-800 group-hover:border-white/30 bg-black aspect-[9/19] transition-all duration-500">
                        <img
                          src={w.imageUrl}
                          alt={w.title}
                          loading="lazy"
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 border-[4px] border-black rounded-[1.5rem] pointer-events-none" />
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-10" />
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
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── RIGHT SIDEBAR (desktop stats + filters) ── */}
      <aside className="w-56 hidden xl:flex flex-col py-10 px-6 border-l border-brand-line bg-brand-medium shrink-0">
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
            <button onClick={handleLogin} disabled={isLoggingIn} className="flex items-center gap-2 px-4 py-2.5 border border-brand-line text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white transition-all w-full justify-center">
              {isLoggingIn ? (<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Gauge className="w-4 h-4" /></motion.div>) : (<User className="w-4 h-4" />)}
              {isLoggingIn ? 'CONNECTING...' : 'SIGN IN'}
            </button>
          )}
        </div>

        <div className="space-y-12">
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">DESKTOP WALLPAPERS</p>
            <p className="text-5xl font-light font-sans leading-none tracking-tighter">{collectionSize}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">MOBILE WALLPAPERS</p>
            <p className="text-5xl font-light font-sans leading-none tracking-tighter">{PHONE_WALLPAPERS.length}</p>
          </div>

          {/* Desktop brand dropdown */}
          {activeSection === 'desktop' && (
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
                        <button key={brand} onClick={() => setSelectedBrand(prev => prev === brand ? null : brand)}
                          className={`flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${selectedBrand === brand ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-brand-line hover:border-white/30 hover:text-white'}`}>
                          <span>{brand}</span><span className="opacity-40 tabular-nums">{count}</span>
                        </button>
                      ))}
                      {selectedBrand && (
                        <button onClick={() => setSelectedBrand(null)} className="mt-2 flex items-center justify-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/50 transition-all">
                          <X className="w-3 h-3" />CLEAR FILTER
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Phone brand dropdown in sidebar */}
          {activeSection === 'phone' && phoneBrands.length > 0 && (
            <div>
              <button onClick={() => setPhoneBrandsOpen(prev => !prev)} className="w-full flex items-center justify-between group/pbrands">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover/pbrands:text-white/60 transition-colors">BROWSE BY BRAND</p>
                <motion.span animate={{ rotate: phoneBrandsOpen ? 90 : 0 }} transition={{ duration: 0.25 }} className="text-white/30 group-hover/pbrands:text-white/60 transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {phoneBrandsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="flex flex-col gap-1 mt-4">
                      {phoneBrands.map(([brand, count]) => (
                        <button key={brand} onClick={() => setSelectedPhoneBrand(prev => prev === brand ? null : brand)}
                          className={`flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${selectedPhoneBrand === brand ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-brand-line hover:border-white/30 hover:text-white'}`}>
                          <span>{brand}</span><span className="opacity-40 tabular-nums">{count}</span>
                        </button>
                      ))}
                      {selectedPhoneBrand && (
                        <button onClick={() => setSelectedPhoneBrand(null)} className="mt-2 flex items-center justify-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/50 transition-all">
                          <X className="w-3 h-3" />CLEAR FILTER
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-auto pt-12 border-t border-brand-line">
          <p className="text-[11px] leading-relaxed text-white/30 font-medium tracking-tight">Velocity is a curated platform for high-quality automotive wallpapers. Discover and explore a refined collection built for enthusiasts.</p>
        </div>
      </aside>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) setSelectedWallpaper(null); }}
          >
            <div className="min-h-full flex flex-col">
              <motion.div
                layoutId={selectedWallpaper.id}
                className="relative w-full bg-brand-medium border-b border-white/10 flex flex-col"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedWallpaper(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-black hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* ── TOP: Image LEFT + Info RIGHT ── */}
                <div className="flex flex-col lg:flex-row">

                  {/* Image */}
                  <div className="flex-1 bg-black flex items-center justify-center relative" style={{ minHeight: '300px' }}>
                    <img
                      src={selectedWallpaper.imageUrl}
                      alt={selectedWallpaper.title}
                      className="w-full h-full object-contain max-h-[70vh] lg:max-h-[75vh]"
                    />
                    <button
                      onClick={e => toggleFavorite(e, selectedWallpaper.id)}
                      className={`absolute bottom-6 right-6 z-10 p-4 glass backdrop-blur-xl border-white/20 rounded-full transition-all duration-300 ${favorites.includes(selectedWallpaper.id) ? 'bg-red-500 border-red-500 scale-110 shadow-2xl shadow-red-500/20' : 'bg-black/40 hover:bg-black/60'}`}
                    >
                      <Heart className={`w-6 h-6 md:w-8 md:h-8 ${favorites.includes(selectedWallpaper.id) ? 'fill-current text-white' : 'text-white'}`} />
                    </button>
                  </div>

                  {/* Info Panel */}
                  <div className="w-full lg:w-96 p-6 md:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#050505]">
                    <div>
                      {/* Category badge + title */}
                      <span className="badge mb-3 md:mb-4">{selectedWallpaper.category}</span>
                      <h2 className="text-3xl md:text-4xl font-display font-black italic uppercase tracking-tighter mb-2 leading-[0.9]">
                        {selectedWallpaper.title}
                      </h2>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        {selectedWallpaper.brand}
                      </p>

                      {/* About / Heritage / Details — always visible, no tabs */}
                      {carInfoLoading ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-white/30 mb-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                              <Gauge className="w-4 h-4" />
                            </motion.div>
                            <span className="text-[10px] font-black uppercase tracking-widest">LOADING...</span>
                          </div>
                          {[75, 55, 85, 45, 65, 50].map((w, i) => (
                            <motion.div key={i} className="h-2.5 bg-white/5 rounded-sm" style={{ width: `${w}%` }}
                              animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.12 }} />
                          ))}
                        </div>
                      ) : carInfo ? (
                        <div className="space-y-6">
                          {/* About */}
                          <div className="border-t border-white/8 pt-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">ABOUT</p>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">{carInfo.about}</p>
                          </div>
                          {/* Heritage */}
                          <div className="border-t border-white/8 pt-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">HERITAGE</p>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">{carInfo.history}</p>
                          </div>
                          {/* Details */}
                          <div className="border-t border-white/8 pt-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">DETAILS</p>
                            <ul className="space-y-2">
                              {carInfo.facts.map((fact, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-white/20 font-black text-[10px] mt-0.5 shrink-0">✦</span>
                                  <span className="text-[11px] text-white/60 font-medium leading-snug">{fact}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => handleDownload(selectedWallpaper)}
                        disabled={isDownloading}
                        className="w-full bg-white text-black py-4 md:py-5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                      >
                        <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                        {isDownloading ? 'DOWNLOADING...' : 'INITIATE DOWNLOAD'}
                      </button>
                      <button
                        onClick={() => setSelectedWallpaper(null)}
                        disabled={isDownloading}
                        className="w-full border border-white/10 hover:border-white py-3 md:py-4 font-black uppercase text-[9px] tracking-widest transition-all disabled:opacity-50"
                      >
                        RETURN TO GRID
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── BOTTOM: You May Also Like — always shown, full width ── */}
                <div className="border-t border-white/10 p-5 md:p-8 bg-[#050505]">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-white/40" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">YOU MAY ALSO LIKE</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {similarCars.map(car => (
                      <Link
                        key={car.id}
                        to={`/brand/${car.brand.toLowerCase()}/${car.slug}`}
                        onClick={() => setSelectedWallpaper(null)}
                        className="group border border-white/10 hover:border-white/30 transition-all overflow-hidden bg-black"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={car.imageUrl}
                            alt={car.title}
                            className="w-full h-full object-cover brightness-50 group-hover:brightness-90 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-0 inset-x-0 p-2 md:p-3">
                            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40 leading-none">{car.brand}</p>
                            <p className="text-[10px] md:text-[11px] font-display font-black italic uppercase tracking-tight leading-tight mt-0.5">{car.title}</p>
                          </div>
                        </div>
                        <div className="p-1.5 md:p-2 flex gap-1">
                          <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); handleDownload(car); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white hover:text-black text-white/40 text-[8px] font-black uppercase tracking-widest transition-all"
                          >
                            <Download className="w-3 h-3" /><span className="hidden sm:inline">DOWNLOAD</span>
                          </button>
                          <button
                            onClick={e => { e.preventDefault(); toggleFavorite(e, car.id); }}
                            className={`p-2 transition-all ${favorites.includes(car.id) ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}
                          >
                            <Heart className={`w-3 h-3 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE FILTER DRAWER ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-black border-r border-white/10 p-6 overflow-y-auto">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white text-3xl mb-8">✕</button>

            <div className="mb-8">
              <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Collection</div>
              <div className="flex gap-2">
                <button onClick={() => { setActiveSection('desktop'); setMobileMenuOpen(false); }} className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'desktop' ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:bg-white/10'}`}>
                  <Monitor className="w-4 h-4" /> Desktop
                </button>
                <button onClick={() => { setActiveSection('phone'); setMobileMenuOpen(false); }} className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'phone' ? 'bg-white text-black border-white' : 'border-white/10 text-white hover:bg-white/10'}`}>
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>
            </div>

            {activeSection === 'desktop' && (
              <>
                <div className="mb-8">
                  <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Category</div>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => { setSelectedCategory(cat); setMobileMenuOpen(false); }} className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedCategory === cat ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Brand</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setSelectedBrand(null); setMobileMenuOpen(false); }} className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedBrand === null ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>All Brands</button>
                    {brands.map(([brand]) => (
                      <button key={brand} onClick={() => { setSelectedBrand(brand); setMobileMenuOpen(false); }} className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedBrand === brand ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>{brand}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSection === 'phone' && phoneBrands.length > 0 && (
              <div>
                <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">Brand</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setSelectedPhoneBrand(null); setMobileMenuOpen(false); }} className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedPhoneBrand === null ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>All Brands</button>
                  {phoneBrands.map(([brand]) => (
                    <button key={brand} onClick={() => { setSelectedPhoneBrand(brand); setMobileMenuOpen(false); }} className={`w-full border border-white/10 px-4 py-3 text-left tracking-[0.25em] uppercase text-sm transition-all ${selectedPhoneBrand === brand ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>{brand}</button>
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
