import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, X, ChevronRight, Gauge, Heart, User, LogOut } from 'lucide-react';
import { CAR_WALLPAPERS, CATEGORIES, CarWallpaper } from './constants';


const collectionSize = CAR_WALLPAPERS.length;

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

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50"
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
        <header className="px-12 py-8 flex items-center gap-8 border-b border-brand-line">
          

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

        <main className="flex-1 bg-brand-dark p-12 overflow-y-auto">
          {/* Massive Headline */}
          <section className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hero-large"
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
          <div className="flex flex-wrap gap-1 md:gap-2 mb-12 border-b border-brand-line pb-8">
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
                  onClick={() => setSelectedWallpaper(car)}
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

          {/* ── Brands Dropdown ── */}
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              layoutId={selectedWallpaper.id}
              className="relative w-full max-w-5xl max-h-full bg-brand-medium rounded-none overflow-hidden border border-white/10 flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedWallpaper(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-black hover:bg-white hover:text-black transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 min-h-0 bg-black flex items-center justify-center relative">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* DRAWER */}
          <div className="relative w-72 h-full bg-brand-dark border-r border-brand-line p-6 flex flex-col gap-6 overflow-y-auto">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl self-end"
            >
              ✕
            </button>

            {/* MENU ITEMS */}
            <div className="flex flex-col gap-3">

              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMobileMenuOpen(false);
                }}
                className="text-left border border-brand-line px-4 py-3 uppercase text-xs tracking-widest"
              >
                All Grid
              </button>

              {CATEGORIES.map(
                cat =>
                  cat !== 'All' && (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left border border-brand-line px-4 py-3 uppercase text-xs tracking-widest"
                    >
                      {cat}
                    </button>
                  )
              )}

            </div>
          </div>
        </div>
      )}

    </div>

  );
}
    
  );
}
