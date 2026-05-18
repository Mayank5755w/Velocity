import { Link } from 'react-router-dom';
import { Gauge, Instagram, Twitter, Youtube } from 'lucide-react';

const NAV = [
  { label: 'Desktop',    to: '/' },
  { label: 'Mobile',     to: '/' },
  { label: 'Favorites',  to: '/' },
];

const CATEGORIES = [
  { label: 'Supercar',    to: '/category/supercar' },
  { label: 'Hypercar',    to: '/category/hypercar' },
  { label: 'Classic',     to: '/category/classic' },
  { label: 'Off-road',    to: '/category/off-road' },
  { label: 'Luxury',      to: '/category/luxury' },
  { label: 'JDM',         to: '/category/jdm' },
  { label: 'Motor Sport', to: '/category/motor-sport' },
];

const SOCIALS = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'X / Twitter', icon: Twitter, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-brand-line mt-auto">
      {/* ── TOP RULE ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── MAIN GRID ── */}
      <div className="px-6 md:px-12 xl:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── COL 1: Brand ── */}
          <div className="lg:col-span-1">
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-white flex items-center justify-center rotate-45 shrink-0">
                <Gauge className="w-5 h-5 text-black -rotate-45" />
              </div>
              <span className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                VELO<span className="text-white/20">CITY</span>
              </span>
            </div>

            <p className="text-[11px] font-medium leading-relaxed text-white/30 tracking-wide max-w-[220px]">
              A curated repository of premium automotive wallpapers — crafted for enthusiasts who demand the extraordinary.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-8">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-brand-line flex items-center justify-center text-white/30 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 2: Navigation ── */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-white/10 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Categories ── */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-5">
              Categories
            </p>
            <ul className="space-y-3">
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-white/10 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: Experience ── */}
<div className="border-l border-brand-line pl-6">
  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-5">
    Experience
  </p>

  <h3 className="text-3xl font-black italic uppercase leading-none tracking-tight">
    BUILT
    <br />
    FOR
    <br />
    ENTHUSIASTS
  </h3>

  <p className="mt-6 text-[11px] leading-relaxed text-white/30 max-w-[220px]">
    Cinematic automotive wallpapers crafted for desktop and mobile experiences.
  </p>
</div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="mt-16 mb-8 h-px bg-brand-line" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/20">
            © {year} Velocity — All rights reserved
          </p>

          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a
                key={item}
                href="#"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM RULE ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* ── WATERMARK ── */}
      <div className="py-3 flex items-center justify-center">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/8 select-none">
          VELOCITY ✦ PREMIUM AUTOMOTIVE WALLPAPERS
        </p>
      </div>
    </footer>
  );
}
