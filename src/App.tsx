import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, X, ChevronRight, Gauge, Heart, User, LogOut, BookOpen, Sparkles } from 'lucide-react';
import { CAR_WALLPAPERS, CATEGORIES, CarWallpaper } from './constants';



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

  // Simulated Auth State
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Favorites State (Local Storage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('velocity_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Brand filter state
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandsOpen, setBrandsOpen] = useState(false);

  // Modal tab + AI state
  const [activeTab, setActiveTab] = useState<'info' | 'similar'>('info');
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [carInfoLoading, setCarInfoLoading] = useState(false);
  const [similarCars, setSimilarCars] = useState<CarWallpaper[]>([]);

  useEffect(() => {
    localStorage.setItem('velocity_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setUser({
        name: 'Velocity Enthusiast',
        email: 'user@example.com',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=velocity',
      });
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
  };

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
    } catch (error) {
      console.error('Download failed, falling back to new tab:', error);
      window.open(car.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Derive sorted brand list with counts
  const brands = useMemo(() => {
    const map: Record<string, number> = {};
    CAR_WALLPAPERS.forEach(car => {
      map[car.brand] = (map[car.brand] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  const filteredWallpapers = useMemo(() => {
    return CAR_WALLPAPERS.filter(car => {
      const matchesSearch =
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase());

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

  // Compute similar cars: same category gets priority, same brand is a bonus
  const computeSimilarCars = useCallback((car: CarWallpaper) => {
    const others = CAR_WALLPAPERS.filter(c => c.id !== car.id);
    const scored = others.map(c => ({
      car: c,
      score:
        (c.category === car.category ? 3 : 0) +
        (c.brand === car.brand ? 2 : 0) +
        Math.random(),
    }));
    scored.sort((a, b) => b.score - a.score);
    setSimilarCars(scored.slice(0, 4).map(s => s.car));
  }, []);

  

const data = await response.json();

const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text || '';

const clean = text.replace(/```json|```/g, '').trim();

try {
  const parsed: CarInfo = JSON.parse(clean);

  setCarInfo(parsed);
  carInfoCache[car.id] = parsed;
} catch (err) {
  console.error('Invalid AI JSON:', clean);

  setCarInfo({
    about: `${car.brand} delivers cutting-edge engineering blended with premium automotive craftsmanship.`,
    
    history: `${car.brand} has built a strong reputation in the automotive world through innovation, performance, and iconic vehicle design.`,
    
    facts: [
      'High-performance automotive platform',
      'Premium engineering and design',
      'Advanced drivetrain technology',
      'Part of the Velocity curated collection',
    ],
  });
}
    } catch (err) {
      console.error('Car info fetch failed:', err);
      setCarInfo({
        about: `The ${car.brand} is a masterclass in automotive engineering — a machine that balances raw performance with refined design.`,
        history: `${car.brand} has been at the forefront of automotive innovation for decades, consistently pushing the boundaries of what's possible on four wheels.`,
        facts: [
          `4K Ultra HD resolution wallpaper`,
          `Category: ${car.category}`,
          `Brand: ${car.brand}`,
          'Part of the Velocity curated collection',
        ],
      });
    } finally {
      setCarInfoLoading(false);
    }
  }, []);

  // Open modal: reset tab, fetch info, compute similar
  const openModal = useCallback(
    (car: CarWallpaper) => {
      setSelectedWallpaper(car);
      setActiveTab('info');
      setCarInfo(null);
      fetchCarInfo(car);
      computeSimilarCars(car);
    },
    [fetchCarInfo, computeSimilarCars]
  );

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-black/80 border border-white/10 w-12 h-12 flex items-center justify-center text-2xl backdrop-blur-md"
      >
        ☰
      </button>
      {/* Sidebar Navigation */}
      <aside className="w-20 hidden lg:flex flex-col items-center justify-between py-12 border-r border-brand-line shrink-0">
        <div className="flex flex-col gap-12 items-center">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center rotate-45 transform transition-transform hover:rotate-225 duration-700">
            <Gauge className="w-6 h-6 text-black -rotate-45" />
          </div>
          <div className="flex flex-col gap-8">
            <div
              onClick={() => setSelectedCategory('All')}
              className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${selectedCategory === 'All' ? 'text-white' : 'text-white/30 hover:text-white'}`}
            >
              GRID
            </div>
            <div
              onClick={() => setSelectedCategory('Favorites')}
              className={`vertical-text uppercase tracking-[0.4em] text-[9px] font-black transition-colors cursor-pointer ${selectedCategory === 'Favorites' ? 'text-white' : 'text-white/30 hover:text-white'}`}
            >
              SAVED ({favorites.length})
            </div>
          </div>
        </div>
        <div className="text-xl font-black italic">V</div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header / Search */}
        <header className="px-4 md:px-12 py-6 md:py-8 flex items-center gap-4 md:gap-8 border-b border-brand-line">
          <div className="flex-1 relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="SEARCH ALL MODELS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-brand-medium border border-brand-line rounded-none py-3 pl-11 pr-6 text-xs font-black uppercase tracking-widest focus:outline-hidden focus:border-white transition-all w-full"
            />
          </div>
        </header>

        <main className="flex-1 bg-brand-dark p-4 md:p-12 overflow-y-auto">
          {/* Massive Headline */}
          <section className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-[10rem] font-black italic leading-none tracking-tight"
            >
              {selectedCategory === 'Favorites' ? 'SAVED' : 'VELO'}
              <span className="text-brand-line">
                {selectedCategory === 'Favorites' ? 'CARS' : 'CITY'}
              </span>
            </motion.h2>
            <div className="flex items-center gap-4 mt-6">
              <div className="h-[1px] bg-brand-line flex-1" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                {selectedCategory === 'Favorites'
                  ? 'YOUR PERSONAL COLLECTION'
                  : selectedBrand
                  ? `FILTERING — ${selectedBrand.toUpperCase()}`
                  : 'PREMIUM AUTOMOTIVE REPOSITORY'}
              </p>
            </div>
          </section>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-12 border-b border-brand-line pb-8">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                selectedCategory === 'All'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/50 border-brand-line hover:border-white/40 hover:text-white'
              }`}
            >
              All Grid
            </button>

            <div className="w-[1px] h-8 bg-brand-line mx-4" />
            {CATEGORIES.map(
              cat =>
                cat !== 'All' && (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                      selectedCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white/50 border-brand-line hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
            )}
          </div>

          {/* Wallpaper Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredWallpapers.map(car => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative cursor-pointer border border-brand-line bg-brand-medium overflow-hidden"
                  onClick={() => openModal(car)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.title} wallpaper`}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />

                    {/* Favorite Button on Card */}
                    <button
                      onClick={e => toggleFavorite(e, car.id)}
                      className={`absolute top-6 right-6 z-10 p-3 glass backdrop-blur-md transition-all duration-300 ${
                        favorites.includes(car.id)
                          ? 'bg-red-500 border-red-500 opacity-100'
                          : 'opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-current text-white' : 'text-white'}`}
                      />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="badge">{car.resolution}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                          {car.category}
                        </span>
                      </div>
                      <h3 className="text-3xl font-display font-black italic uppercase tracking-tighter leading-none">
                        {car.title}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">
                        {car.brand}
                      </p>
                    </div>
                    {/* Linear overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredWallpapers.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-brand-line">
              <h3 className="text-xl font-display font-black uppercase tracking-wider text-white/20 italic">
                {selectedCategory === 'Favorites' ? 'NO SAVED GEAR YET' : 'NOTHING FOUND IN THE GRID'}
              </h3>
            </div>
          )}
        </main>
      </div>

      {/* Stats Panel */}
      <aside className="w-80 hidden xl:flex flex-col p-12 border-l border-brand-line bg-brand-surface shrink-0">
        <div className="flex flex-col gap-3 mb-12">

          {/* Favorites Button */}
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === 'Favorites' ? 'All' : 'Favorites'
              )
            }
            className={`w-full flex items-center justify-between px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedCategory === 'Favorites'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/50 border-brand-line hover:border-white/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart
                className={`w-4 h-4 ${
                  favorites.length > 0 ? 'fill-current text-red-500' : ''
                }`}
              />
              FAVORITES
            </div>
            <span>{favorites.length}</span>
          </button>

          {/* Sign In / User */}
          {user ? (
            <div className="border border-brand-line p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.photo}
                  alt="User"
                  className="w-10 h-10 border border-brand-line p-1 grayscale"
                />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {user.name}
                  </p>
                  <p className="text-[9px] text-white/30 mt-1">
                    PRO ENTHUSIAST
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Gauge className="w-4 h-4" />
                </motion.div>
              ) : (
                <User className="w-4 h-4" />
              )}
              {isLoggingIn ? 'CONNECTING...' : 'SIGN IN'}
            </button>
          )}
        </div>

        <div className="space-y-16">

          {/* Collection size stat */}
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">COLLECTION SIZE</p>
            <p className="text-5xl font-light font-sans leading-none tracking-tighter">{collectionSize}</p>
          </div>

          {/* Brands Dropdown */}
          <div>
            <button
              onClick={() => setBrandsOpen(prev => !prev)}
              className="w-full flex items-center justify-between group/brands"
            >
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover/brands:text-white/60 transition-colors">
                BROWSE BY BRAND
              </p>
              <motion.span
                animate={{ rotate: brandsOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="text-white/30 group-hover/brands:text-white/60 transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {brandsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-1 mt-4">
                    {brands.map(([brand, count]) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(prev => (prev === brand ? null : brand))}
                        className={`flex items-center justify-between px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                          selectedBrand === brand
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white/40 border-brand-line hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>{brand}</span>
                        <span className="opacity-40 tabular-nums">{count}</span>
                      </button>
                    ))}

                    {/* Clear brand filter */}
                    {selectedBrand && (
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className="mt-2 flex items-center justify-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] border border-dashed border-white/20 text-white/30 hover:text-white hover:border-white/50 transition-all"
                      >
                        <X className="w-3 h-3" />
                        CLEAR FILTER
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto pt-12 border-t border-brand-line">
          <p className="text-[11px] leading-relaxed text-white/30 font-medium tracking-tight">
            Velocity is a curated platform for high-quality automotive wallpapers. Discover and explore a refined
            collection built for enthusiasts.
          </p>
        </div>
      </aside>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) setSelectedWallpaper(null); }}
          >
            <motion.div
              layoutId={selectedWallpaper.id}
              className="relative w-full max-w-5xl bg-brand-medium rounded-none border border-white/10 flex flex-col my-auto"
            >
              <button
                onClick={() => setSelectedWallpaper(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-black hover:bg-white hover:text-black transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Original top layout: image + sidebar — untouched */}
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 min-h-0 bg-black flex items-center justify-center relative" style={{ minHeight: '300px' }}>
                  <img
                    src={selectedWallpaper.imageUrl}
                    alt={selectedWallpaper.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />

                  {/* Absolute Heart on Modal Image */}
                  <button
                    onClick={e => toggleFavorite(e, selectedWallpaper.id)}
                    className={`absolute bottom-8 right-8 z-10 p-5 glass backdrop-blur-xl border-white/20 rounded-full transition-all duration-300 ${
                      favorites.includes(selectedWallpaper.id)
                        ? 'bg-red-500 border-red-500 scale-110 shadow-2xl shadow-red-500/20'
                        : 'bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    <Heart
                      className={`w-8 h-8 ${favorites.includes(selectedWallpaper.id) ? 'fill-current text-white' : 'text-white'}`}
                    />
                  </button>
                </div>

                <div className="w-full md:w-80 p-10 flex flex-col justify-start border-t md:border-t-0 md:border-l border-white/10">
                  <div>
                    <span className="badge mb-4">{selectedWallpaper.category}</span>
                    <h2 className="text-4xl font-display font-black italic uppercase tracking-tighter mb-2 leading-[0.9]">
                      {selectedWallpaper.title}
                    </h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                      {selectedWallpaper.brand}
                    </p>
                  </div>

                  <div className="mt-2 space-y-3">
                    <button
                      onClick={() => handleDownload(selectedWallpaper)}
                      disabled={isDownloading}
                      className="w-full bg-white text-black py-5 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                    >
                      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                      {isDownloading ? 'DOWNLOADING...' : 'INITIATE DOWNLOAD'}
                    </button>
                    <button
                      onClick={() => setSelectedWallpaper(null)}
                      disabled={isDownloading}
                      className="w-full border border-white/10 hover:border-white py-4 font-black uppercase text-[9px] tracking-widest transition-all disabled:opacity-50"
                    >
                      RETURN TO GRID
                    </button>
                  </div>
                </div>
              </div>

              {/* ── NEW: Tabs section appended below ── */}
              <div className="border-t border-white/10">
                {/* Tab bar */}
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex items-center gap-2.5 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                      activeTab === 'info'
                        ? 'border-white text-white'
                        : 'border-transparent text-white/30 hover:text-white/60'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    ABOUT & HISTORY
                  </button>
                  <button
                    onClick={() => setActiveTab('similar')}
                    className={`flex items-center gap-2.5 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                      activeTab === 'similar'
                        ? 'border-white text-white'
                        : 'border-transparent text-white/30 hover:text-white/60'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    YOU MAY ALSO LIKE
                  </button>
                </div>

                {/* Tab panels */}
                <AnimatePresence mode="wait">
                  {activeTab === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-8 min-h-[160px]"
                    >
                      {carInfoLoading ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 text-white/30 mb-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                            >
                              <Gauge className="w-4 h-4" />
                            </motion.div>
                            <span className="text-[10px] font-black uppercase tracking-widest">LOADING...</span>
                          </div>
                          {[75, 55, 85, 45, 65, 50].map((w, i) => (
                            <motion.div
                              key={i}
                              className="h-2.5 bg-white/5 rounded-sm"
                              style={{ width: `${w}%` }}
                              animate={{ opacity: [0.3, 0.7, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.12 }}
                            />
                          ))}
                        </div>
                      ) : carInfo ? (
                        <div className="grid md:grid-cols-3 gap-8">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">ABOUT</p>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">{carInfo.about}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">HERITAGE</p>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">{carInfo.history}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">DETAILS</p>
                            <ul className="space-y-2.5">
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
                    </motion.div>
                  )}

                  {activeTab === 'similar' && (
                    <motion.div
                      key="similar"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-8"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {similarCars.map(car => (
                          <div
                            key={car.id}
                            className="group cursor-pointer border border-white/10 hover:border-white/30 transition-all overflow-hidden bg-black"
                            onClick={() => openModal(car)}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={car.imageUrl}
                                alt={car.title}
                                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-0 inset-x-0 p-3">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none">{car.brand}</p>
                                <p className="text-[11px] font-display font-black italic uppercase tracking-tight leading-tight mt-0.5">{car.title}</p>
                              </div>
                            </div>
                            <div className="p-2 flex gap-1">
                              <button
                                onClick={e => { e.stopPropagation(); handleDownload(car); }}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white hover:text-black text-white/40 text-[8px] font-black uppercase tracking-widest transition-all"
                              >
                                <Download className="w-3 h-3" />
                                DOWNLOAD
                              </button>
                              <button
                                onClick={e => toggleFavorite(e, car.id)}
                                className={`p-2 transition-all ${favorites.includes(car.id) ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}
                              >
                                <Heart className={`w-3 h-3 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-6 text-center">
                        CLICK ANY CAR TO VIEW FULL DETAILS
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FILTER DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* DRAWER */}
          <div className="relative w-72 h-full bg-black border-r border-white/10 p-6 overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-3xl mb-8"
            >
              ✕
            </button>

            {/* CATEGORY FILTER */}
            <div className="mb-8">
              <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">
                Filter By Category
              </div>
              <div className="flex flex-col gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full border border-white/10 px-4 py-4 text-left
                      tracking-[0.25em] uppercase text-sm transition-all duration-300
                      ${
                        selectedCategory === category
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* BRAND FILTER */}
            <div>
              <div className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-4">
                Filter By Brand
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setSelectedBrand(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full border border-white/10 px-4 py-4 text-left
                    tracking-[0.25em] uppercase text-sm transition-all duration-300
                    ${
                      selectedBrand === null
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white/10'
                    }
                  `}
                >
                  All Brands
                </button>

                {brands.map(([brand]) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full border border-white/10 px-4 py-4 text-left
                      tracking-[0.25em] uppercase text-sm transition-all duration-300
                      ${
                        selectedBrand === brand
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
