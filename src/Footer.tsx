import { Link } from 'react-router-dom';
import { Gauge, Instagram, Twitter, Youtube } from 'lucide-react';

const NAV = [
  { label: 'Desktop',    to: '/' },
  { label: 'Mobile',     to: '/mobile' },
  { label: 'About',      to: '/about' },
  { label: 'Contact',    to: '/contact' },
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

const LEGAL = [
  { label: 'Privacy',  to: '/privacy' },
  { label: 'Terms',    to: '/terms' },
  { label: 'DMCA',     to: '/dmca' },
  { label: 'Contact',  to: '/contact' },
];

const SOCIALS = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'X / Twitter', icon: Twitter, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-zinc-900 w-full">
      {/* ── TOP RULE ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── MAIN GRID ── */}
      <div className="px-6 md:px-12 xl:px-16 pt-12 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

          {/* ── COL 1: Brand ── */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center rotate-45 shrink-0">
                <Gauge className="w-4 h-4 text-black -rotate-45" />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter leading-none">
                VELO<span className="text-white/20">CITY</span>
              </span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-white/30 tracking-wide max-w-[220px] mb-6">
              A curated repository of premium automotive wallpapers — crafted for enthusiasts who demand the extraordinary.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 border border-zinc-800 flex items-center justify-center text-white/30 hover:text-white hover:border-white/40 transition-all duration-300">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 2: Navigation ── */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {NAV.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-4 h-px bg-white/10 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Categories ── */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Categories</p>
            <ul className="space-y-2.5">
              {CATEGORIES.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                    className="text-[12px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-4 h-px bg-white/10 group-hover:bg-white/50 group-hover:w-6 transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: Experience ── */}
          <div className="border-l border-zinc-900 pl-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Experience</p>
            <h3 className="text-2xl font-black italic uppercase leading-none tracking-tight mb-4">
              BUILT<br />FOR<br />ENTHUSIASTS
            </h3>
            <p className="text-[11px] leading-relaxed text-white/30 max-w-[200px]">
              Cinematic automotive wallpapers crafted for desktop and mobile experiences.
            </p>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="mt-10 mb-6 h-px bg-zinc-900" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/20">
            © {year} Velocity — All rights reserved
          </p>
          <div className="flex items-center gap-6">
            {LEGAL.map(({ label, to }) => (
              <Link key={label} to={to}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM WATERMARK ── */}
      <div className="py-2 flex items-center justify-center border-t border-zinc-900/50">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-white/[0.06] select-none">
          VELOCITY ✦ PREMIUM AUTOMOTIVE WALLPAPERS
        </p>
      </div>
    </footer>
  );
}
