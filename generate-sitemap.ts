/**
 * generate-sitemap.ts
 * Run: npm run sitemap  (auto-called by npm run build)
 */
import { writeFileSync, mkdirSync } from 'fs';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS, CATEGORIES } from './src/constants';

const BASE_URL = 'https://velocitywallpapers.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// ── Convert any string to a safe URL slug (spaces → hyphens, lowercase) ──
function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function urlEntry(loc: string, priority = '0.8', changefreq = 'weekly'): string {
  // Encode the loc — replace any remaining spaces just in case
  const clean = loc.replace(/\s+/g, '-');
  return `  <url><loc>${clean}</loc><lastmod>${TODAY}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

function sitemapDoc(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

mkdirSync('./public', { recursive: true });

// 1. sitemap-desktop.xml — exclude 'Unknown' brand
const desktopUrls = CAR_WALLPAPERS
  .filter(car => car.brand !== 'Unknown')
  .map(car => urlEntry(`${BASE_URL}/brand/${toSlug(car.brand)}/${car.slug}`, '0.9', 'monthly'));
writeFileSync('./public/sitemap-desktop.xml', sitemapDoc(desktopUrls), 'utf-8');
console.log(`✓ sitemap-desktop.xml  — ${desktopUrls.length} URLs`);

// 2. sitemap-mobile.xml
const mobileUrls = PHONE_WALLPAPERS.map(w =>
  urlEntry(`${BASE_URL}/mobile/${w.slug}`, '0.9', 'monthly'));
writeFileSync('./public/sitemap-mobile.xml', sitemapDoc(mobileUrls), 'utf-8');
console.log(`✓ sitemap-mobile.xml   — ${mobileUrls.length} URLs`);

// 3. sitemap-brands.xml — exclude 'Unknown', slugify multi-word brands
const uniqueBrands = [...new Set(CAR_WALLPAPERS.map(w => w.brand))]
  .filter(b => b !== 'Unknown')
  .sort();
const brandUrls = uniqueBrands.map(brand =>
  urlEntry(`${BASE_URL}/brand/${toSlug(brand)}`, '0.8', 'weekly'));
writeFileSync('./public/sitemap-brands.xml', sitemapDoc(brandUrls), 'utf-8');
console.log(`✓ sitemap-brands.xml   — ${brandUrls.length} URLs`);

// 4. sitemap-categories.xml
const validCategories = (CATEGORIES as readonly string[]).filter(c => c !== 'All');
const categoryUrls = validCategories.map(cat =>
  urlEntry(`${BASE_URL}/category/${toSlug(cat)}`, '0.8', 'weekly'));
writeFileSync('./public/sitemap-categories.xml', sitemapDoc(categoryUrls), 'utf-8');
console.log(`✓ sitemap-categories.xml — ${categoryUrls.length} URLs`);

// 5. sitemap-static.xml
const staticUrls = [
  urlEntry(`${BASE_URL}/`, '1.0', 'daily'),
  urlEntry(`${BASE_URL}/desktop`, '0.9', 'daily'),
  urlEntry(`${BASE_URL}/mobile`, '0.9', 'daily'),
];
writeFileSync('./public/sitemap-static.xml', sitemapDoc(staticUrls), 'utf-8');
console.log(`✓ sitemap-static.xml   — ${staticUrls.length} URLs`);

// 6. sitemap.xml — index referencing all sub-sitemaps
const sitemapNames = [
  'sitemap-static.xml',
  'sitemap-desktop.xml',
  'sitemap-mobile.xml',
  'sitemap-brands.xml',
  'sitemap-categories.xml',
];
const indexEntries = sitemapNames.map(name =>
  `  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`
);
const mainIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntries.join('\n')}
</sitemapindex>`;
writeFileSync('./public/sitemap.xml', mainIndex, 'utf-8');
console.log(`✓ sitemap.xml          — index referencing ${sitemapNames.length} sitemaps`);

console.log(`\n✓ All sitemaps generated — ${desktopUrls.length + mobileUrls.length} total wallpaper URLs`);
