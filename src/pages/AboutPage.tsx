import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS, CATEGORIES } from '../constants';

const STATS = [
  { value: `${CAR_WALLPAPERS.length}+`, label: 'Desktop Wallpapers' },
  { value: `${PHONE_WALLPAPERS.length}+`, label: 'Mobile Wallpapers' },
  { value: `${CATEGORIES.length - 1}`, label: 'Categories' },
  { value: '4K', label: 'Ultra HD Quality' },
];

const VALUES = [
  {
    title: 'Curated Quality',
    body: 'Every wallpaper in our collection is hand-selected for composition, resolution, and visual impact. We reject anything that doesn\'t meet our standard.',
  },
  {
    title: 'Always Free',
    body: 'Velocity is and always will be free to use. No accounts, no paywalls, no watermarks. Download any wallpaper instantly.',
  },
  {
    title: 'Built for Enthusiasts',
    body: 'We are car people first. Every decision — from the categories we build to the images we choose — is made with the automotive community in mind.',
  },
  {
    title: 'Desktop & Mobile',
    body: 'Our collection spans both portrait and landscape formats, purpose-built for every screen from a 4K monitor to the latest iPhone.',
  },
];

export default function AboutPage() {
  useSEO({
    title: 'About Velocity | Premium Automotive Wallpapers',
    description: 'Velocity is a curated repository of premium 4K automotive wallpapers for desktop and mobile. Learn about our mission, collection, and the people behind it.',
    ogUrl: '/about',
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── HEADER ── */}
      <header className="border-b border-zinc-900 px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center rotate-45 transform group-hover:rotate-[225deg] transition-transform duration-700">
            <Gauge className="w-4 h-4 text-black -rotate-45" />
          </div>
          <span className="text-lg font-black italic uppercase tracking-tighter">
            VELO<span className="text-zinc-700">CITY</span>
          </span>
        </Link>
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          ← Back
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 md:px-16 xl:px-24 pt-16 pb-12 border-b border-zinc-900">
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Who We Are</p>
        <h1 className="text-6xl md:text-[9rem] font-black italic uppercase leading-[0.88] tracking-tight mb-8">
          ABOUT
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
          Velocity is a curated repository of premium automotive wallpapers — built by enthusiasts, for enthusiasts. We believe your screen should reflect your passion.
        </p>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-900">
        {STATS.map(({ value, label }) => (
          <div key={label} className="px-8 py-10 border-r border-zinc-900 last:border-r-0">
            <p className="text-5xl md:text-6xl font-black italic tracking-tight mb-2">{value}</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">{label}</p>
          </div>
        ))}
      </section>

      {/* ── MISSION ── */}
      <section className="px-6 md:px-16 xl:px-24 py-16 md:py-20 border-b border-zinc-900">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6">Our Mission</p>
          <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.92] tracking-tight mb-8">
            MAKING GREAT AUTOMOTIVE ART ACCESSIBLE TO EVERYONE
          </h2>
          <div className="space-y-5 text-zinc-400 text-base leading-relaxed font-light">
            <p>
              The internet is full of car wallpapers — but finding genuinely great ones is harder than it should be. Low resolution, bad cropping, wrong aspect ratios, intrusive watermarks. We got frustrated and built the alternative.
            </p>
            <p>
              Velocity started as a personal collection and grew into something larger: a destination where every single image earns its place. Every wallpaper is vetted for quality, resolution, and visual punch before it ever appears on the site.
            </p>
            <p>
              We cover supercars, hypercars, JDM icons, luxury cruisers, off-road legends, motorsport machines, and classic vehicles — in both landscape format for your desktop and portrait format for your phone.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 md:px-16 xl:px-24 py-16 md:py-20 border-b border-zinc-900">
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-12">What We Stand For</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900">
          {VALUES.map(({ title, body }) => (
            <div key={title} className="bg-[#050505] p-8 md:p-10 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase tracking-tight mb-4">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COLLECTION CTA ── */}
      <section className="px-6 md:px-16 xl:px-24 py-16 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Ready to explore?</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.92] tracking-tight">
            BROWSE THE<br />COLLECTION
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300">
            Desktop Wallpapers
          </Link>
          <Link to="/mobile" className="px-8 py-4 border border-zinc-700 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all duration-300">
            Mobile Wallpapers
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
