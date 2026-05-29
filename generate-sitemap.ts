/**
 * generate-sitemap.ts
 *
 * Generates ALL sitemaps from actual constants data.
 * Runs automatically on every build via: npm run build
 * Can also be run manually: npm run sitemap
 *
 * Output files in /public:
 *   sitemap.xml            — sitemap index (references all sub-sitemaps)
 *   sitemap-static.xml     — home, desktop, mobile, about, contact, legal pages
 *   sitemap-desktop.xml    — all desktop wallpaper pages
 *   sitemap-mobile.xml     — all mobile wallpaper pages
 *   sitemap-brands.xml     — all brand pages
 *   sitemap-categories.xml — all category pages
 */

import { writeFileSync, mkdirSync } from 'fs';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS, CATEGORIES } from './src/constants';

const BASE_URL = 'https://velocitywallpapers.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// ── Converts "Rolls Royce" → "rolls-royce", "Motor Sport" → "motor-sport"
function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// ── Builds a single <url> entry
function url(
  path: string,
  priority: string,
  changefreq: 'daily' | 'weekly' | 'monthly'
): string {
  const loc = `${BASE_URL}${path}`.replace(/\s+/g, '-');
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// ── Wraps URL entries in a <urlset> document
function urlset(entries: string[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');
}

// ── Builds the sitemap index file
function sitemapIndex(names: string[]): string {
  const entries = names.map(name =>
    [
      '  <sitemap>',
      `    <loc>${BASE_URL}/${name}</loc>`,
      `    <lastmod>${TODAY}</lastmod>`,
      '  </sitemap>',
    ].join('\n')
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</sitemapindex>',
  ].join('\n');
}

// ── Ensure /public exists
mkdirSync('./public', { recursive: true });

// ─────────────────────────────────────────────────────────────
// 1. sitemap-static.xml
//    Add new static pages here whenever you create one
// ─────────────────────────────────────────────────────────────
const staticEntries = [
  url('/',         '1.0', 'daily'),
  url('/desktop',  '0.9', 'daily'),
  url('/mobile',   '0.9', 'daily'),
  url('/about',    '0.7', 'monthly'),
  url('/contact',  '0.6', 'monthly'),
  url('/terms',    '0.5', 'monthly'),
  url('/privacy',  '0.5', 'monthly'),
  url('/dmca',     '0.5', 'monthly'),
];
writeFileSync('./public/sitemap-static.xml', urlset(staticEntries), 'utf-8');
console.log(`✓ sitemap-static.xml      — ${staticEntries.length} URLs`);

// ─────────────────────────────────────────────────────────────
// 2. sitemap-desktop.xml
//    Auto-generated from CAR_WALLPAPERS in constants.ts
//    Just add new entries to CAR_WALLPAPERS and re-run
// ─────────────────────────────────────────────────────────────
const desktopEntries = CAR_WALLPAPERS
  .filter(car => car.brand !== 'Unknown')
  .map(car => url(`/brand/${toSlug(car.brand)}/${car.slug}`, '0.9', 'monthly'));
writeFileSync('./public/sitemap-desktop.xml', urlset(desktopEntries), 'utf-8');
console.log(`✓ sitemap-desktop.xml     — ${desktopEntries.length} URLs`);

// ─────────────────────────────────────────────────────────────
// 3. sitemap-mobile.xml
//    Auto-generated from PHONE_WALLPAPERS in constants.ts
// ─────────────────────────────────────────────────────────────
const mobileEntries = PHONE_WALLPAPERS.map(w =>
  url(`/mobile/${w.slug}`, '0.9', 'monthly')
);
writeFileSync('./public/sitemap-mobile.xml', urlset(mobileEntries), 'utf-8');
console.log(`✓ sitemap-mobile.xml      — ${mobileEntries.length} URLs`);

// ─────────────────────────────────────────────────────────────
// 4. sitemap-brands.xml
//    Auto-derived from unique brands in CAR_WALLPAPERS
// ─────────────────────────────────────────────────────────────
const uniqueBrands = [...new Set(CAR_WALLPAPERS.map(w => w.brand))]
  .filter(b => b !== 'Unknown')
  .sort();
const brandEntries = uniqueBrands.map(brand =>
  url(`/brand/${toSlug(brand)}`, '0.8', 'weekly')
);
writeFileSync('./public/sitemap-brands.xml', urlset(brandEntries), 'utf-8');
console.log(`✓ sitemap-brands.xml      — ${brandEntries.length} URLs`);

// ─────────────────────────────────────────────────────────────
// 5. sitemap-categories.xml
//    Auto-derived from CATEGORIES in constants.ts
// ─────────────────────────────────────────────────────────────
const categoryEntries = (CATEGORIES as readonly string[])
  .filter(c => c !== 'All')
  .map(cat => url(`/category/${toSlug(cat)}`, '0.8', 'weekly'));
writeFileSync('./public/sitemap-categories.xml', urlset(categoryEntries), 'utf-8');
console.log(`✓ sitemap-categories.xml  — ${categoryEntries.length} URLs`);

// ─────────────────────────────────────────────────────────────
// 6. sitemap.xml — index referencing all sub-sitemaps
// ─────────────────────────────────────────────────────────────
const subSitemaps = [
  'sitemap-static.xml',
  'sitemap-desktop.xml',
  'sitemap-mobile.xml',
  'sitemap-brands.xml',
  'sitemap-categories.xml',
];
writeFileSync('./public/sitemap.xml', sitemapIndex(subSitemaps), 'utf-8');
console.log(`✓ sitemap.xml             — index (${subSitemaps.length} sub-sitemaps)`);

// ─────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────
const total =
  staticEntries.length +
  desktopEntries.length +
  mobileEntries.length +
  brandEntries.length +
  categoryEntries.length;

console.log('');
console.log(`✓ All sitemaps written to /public`);
console.log(`  Static pages  : ${staticEntries.length}`);
console.log(`  Desktop walls : ${desktopEntries.length}`);
console.log(`  Mobile walls  : ${mobileEntries.length}`);
console.log(`  Brands        : ${brandEntries.length}`);
console.log(`  Categories    : ${categoryEntries.length}`);
console.log(`  ─────────────────`);
console.log(`  Total URLs    : ${total}`);
