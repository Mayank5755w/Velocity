/**
 * generate-sitemap.ts
 *
 * Generates all sitemaps from the ACTUAL wallpaper data in constants.ts.
 * No fake URLs. No dead URLs. No duplicate slashes.
 *
 * Run: npm run sitemap  (called automatically by `npm run build`)
 *
 * Outputs:
 *  public/sitemap.xml            — sitemap index
 *  public/sitemap-desktop.xml   — all desktop wallpaper pages
 *  public/sitemap-mobile.xml    — all mobile wallpaper pages
 *  public/sitemap-brands.xml    — all brand pages
 *  public/sitemap-categories.xml — all category pages
 */

import { writeFileSync, mkdirSync } from 'fs';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS, CATEGORIES } from './src/constants';

const BASE_URL = 'https://velocitywallpapers.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// ── helpers ──────────────────────────────────────────────────────────────────

function categoryToSlug(cat: string): string {
  return cat.toLowerCase().replace(/\s+/g, '-');
}

function urlEntry(loc: string, priority = '0.8', changefreq = 'weekly'): string {
  // Ensure no double slashes
  const clean = `${BASE_URL}/${loc}`.replace(/([^:]\/)\/+/g, '$1');
  return `  <url>
    <loc>${clean}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function sitemapDoc(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function sitemapIndexDoc(sitemaps: string[]): string {
  const entries = sitemaps.map(name =>
    `  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

// ── ensure public dir ─────────────────────────────────────────────────────────
mkdirSync('./public', { recursive: true });

// ── 1. sitemap-desktop.xml ────────────────────────────────────────────────────
const desktopUrls = CAR_WALLPAPERS.map(car =>
  urlEntry(`brand/${car.brand.toLowerCase()}/${car.slug}`, '0.9', 'monthly')
);
writeFileSync('./public/sitemap-desktop.xml', sitemapDoc(desktopUrls), 'utf-8');
console.log(`✓ sitemap-desktop.xml  — ${desktopUrls.length} URLs`);

// ── 2. sitemap-mobile.xml ─────────────────────────────────────────────────────
const mobileUrls = PHONE_WALLPAPERS.map(w =>
  urlEntry(`mobile/${w.slug}`, '0.9', 'monthly')
);
writeFileSync('./public/sitemap-mobile.xml', sitemapDoc(mobileUrls), 'utf-8');
console.log(`✓ sitemap-mobile.xml   — ${mobileUrls.length} URLs`);

// ── 3. sitemap-brands.xml ─────────────────────────────────────────────────────
const uniqueBrands = [...new Set(CAR_WALLPAPERS.map(w => w.brand))].sort();
const brandUrls = uniqueBrands.map(brand =>
  urlEntry(`brand/${brand.toLowerCase()}`, '0.8', 'weekly')
);
writeFileSync('./public/sitemap-brands.xml', sitemapDoc(brandUrls), 'utf-8');
console.log(`✓ sitemap-brands.xml   — ${brandUrls.length} URLs`);

// ── 4. sitemap-categories.xml ─────────────────────────────────────────────────
const validCategories = CATEGORIES.filter(c => c !== 'All');
const categoryUrls = validCategories.map(cat =>
  urlEntry(`category/${categoryToSlug(cat)}`, '0.8', 'weekly')
);
writeFileSync('./public/sitemap-categories.xml', sitemapDoc(categoryUrls), 'utf-8');
console.log(`✓ sitemap-categories.xml — ${categoryUrls.length} URLs`);

// ── 5. sitemap.xml (index) ────────────────────────────────────────────────────
// Core static pages first, then sub-sitemaps
const staticUrls = [
  urlEntry('', '1.0', 'daily'),            // /
  urlEntry('desktop', '0.9', 'daily'),      // /desktop
  urlEntry('mobile', '0.9', 'daily'),       // /mobile
];

const indexSitemaps = [
  'sitemap-desktop.xml',
  'sitemap-mobile.xml',
  'sitemap-brands.xml',
  'sitemap-categories.xml',
];

// Main sitemap.xml is a sitemap index + static pages in one (index format)
// We put static URLs into their own mini-sitemap and reference it
const staticSitemapXml = sitemapDoc(staticUrls);
writeFileSync('./public/sitemap-static.xml', staticSitemapXml, 'utf-8');

const mainIndex = sitemapIndexDoc(['sitemap-static.xml', ...indexSitemaps]);
writeFileSync('./public/sitemap.xml', mainIndex, 'utf-8');
console.log(`✓ sitemap.xml          — sitemap index referencing ${indexSitemaps.length + 1} sitemaps`);

console.log(`\n✓ All sitemaps generated in /public`);
console.log(`  Total desktop wallpaper URLs : ${desktopUrls.length}`);
console.log(`  Total mobile wallpaper URLs  : ${mobileUrls.length}`);
console.log(`  Total brand URLs             : ${brandUrls.length}`);
console.log(`  Total category URLs          : ${categoryUrls.length}`);
