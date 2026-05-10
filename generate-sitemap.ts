/**
 * generate-sitemap.ts
 * Auto-generates sitemap.xml from constants.ts every build.
 * Run: npm run sitemap   |   Runs auto inside: npm run build
 */

import { writeFileSync } from 'fs';
import { CAR_WALLPAPERS, CATEGORIES, PHONE_WALLPAPERS } from './src/constants.js';

const DOMAIN = 'https://velocitywallpapers.vercel.app';
const today  = new Date().toISOString().split('T')[0];

function slug(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function url(
  loc: string,
  changefreq = 'monthly',
  priority   = '0.6',
  image?: { loc: string; title: string; caption: string }
): string {
  const img = image ? `
    <image:image>
      <image:loc>${esc(image.loc)}</image:loc>
      <image:title>${esc(image.title)}</image:title>
      <image:caption>${esc(image.caption)}</image:caption>
    </image:image>` : '';
  return `
  <url>
    <loc>${DOMAIN}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${img}
  </url>`;
}

const urls: string[] = [];

// ── 1. Homepage ───────────────────────────────────────────────────────────
urls.push(url('/', 'weekly', '1.0'));

// ── 2. Category pages ─────────────────────────────────────────────────────
// One page per category with a count of wallpapers and the first image
const realCats = CATEGORIES.filter(c => c !== 'All') as string[];
for (const cat of realCats) {
  const carsInCat = CAR_WALLPAPERS.filter(c => c.category === cat);
  const first     = carsInCat[0];
  urls.push(
    url(
      `/category/${slug(cat)}`,
      'weekly',
      '0.85',
      first
        ? {
            loc:     `${DOMAIN}${first.imageUrl}`,
            title:   `${cat} Wallpapers — Velocity`,
            caption: `Browse ${carsInCat.length} premium ${cat} car wallpapers.`,
          }
        : undefined
    )
  );
}

// ── 3. Brand index pages (desktop) ────────────────────────────────────────
const desktopBrands = [...new Set(CAR_WALLPAPERS.map(c => c.brand))].sort();
for (const brand of desktopBrands) {
  const carsForBrand = CAR_WALLPAPERS.filter(c => c.brand === brand);
  const first        = carsForBrand[0];
  urls.push(
    url(
      `/brand/${slug(brand)}`,
      'weekly',
      '0.8',
      first
        ? {
            loc:     `${DOMAIN}${first.imageUrl}`,
            title:   `${brand} Wallpapers — Velocity`,
            caption: `${carsForBrand.length} premium ${brand} wallpapers.`,
          }
        : undefined
    )
  );

  // ── 4. Individual car pages ─────────────────────────────────────────────
  for (const car of carsForBrand) {
    urls.push(
      url(
        `/brand/${slug(brand)}/${car.slug}`,
        'monthly',
        '0.6',
        {
          loc:     `${DOMAIN}${car.imageUrl}`,
          title:   `${car.title} – ${brand} ${car.category} 4K Wallpaper`,
          caption: `Download the ${brand} ${car.title} 4K wallpaper. Category: ${car.category}.`,
        }
      )
    );
  }
}

// ── 5. Mobile section ─────────────────────────────────────────────────────
urls.push(url('/mobile', 'weekly', '0.8'));

// Mobile brand pages (skip 'Mobile' catch-all)
const phoneBrands = [...new Set(PHONE_WALLPAPERS.map(w => w.brand).filter(b => b && b !== 'Mobile'))].sort();
for (const brand of phoneBrands) {
  urls.push(url(`/mobile/brand/${slug(brand)}`, 'weekly', '0.75'));
}

// Individual phone wallpaper pages
for (const w of PHONE_WALLPAPERS) {
  urls.push(
    url(
      `/phone/${w.slug}`,
      'monthly',
      '0.55',
      {
        loc:     `${DOMAIN}${w.imageUrl}`,
        title:   `${w.title} – Mobile Wallpaper`,
        caption: `Download the ${w.title} phone wallpaper from Velocity.`,
      }
    )
  );
}

// ── Write ─────────────────────────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${urls.join('')}
</urlset>
`;

writeFileSync('sitemap.xml', sitemap, 'utf-8');

const stats = {
  total:      urls.length,
  categories: realCats.length,
  brands:     desktopBrands.length,
  cars:       CAR_WALLPAPERS.length,
  phone:      PHONE_WALLPAPERS.length,
};

console.log(`✓ sitemap.xml written — ${stats.total} URLs`);
console.log(`  1 homepage`);
console.log(`  ${stats.categories} category pages  (/category/supercar, /category/luxury …)`);
console.log(`  ${stats.brands} brand pages       (/brand/ferrari, /brand/bmw …)`);
console.log(`  ${stats.cars} desktop car pages`);
console.log(`  ${stats.phone} mobile phone pages`);
console.log(`  Domain: ${DOMAIN}`);
