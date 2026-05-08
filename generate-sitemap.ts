/**
 * generate-sitemap.ts
 * 
 * Reads CAR_WALLPAPERS from src/constants.ts and writes sitemap.xml
 * to the project root (public-facing, picked up by Vite build).
 * 
 * Run manually:  npm run sitemap
 * Runs auto:     before every `npm run build`
 */

import { writeFileSync } from 'fs';
import { CAR_WALLPAPERS, CATEGORIES } from './src/constants.js';

// ── CONFIG — change this to your real domain ──────────────────────────────
const DOMAIN = 'https://velocitywallpapers.vercel.app';
// ─────────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

function slug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function escXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function url(
  loc: string,
  opts: {
    changefreq?: string;
    priority?: string;
    image?: { loc: string; title: string; caption: string };
  } = {}
): string {
  const { changefreq = 'monthly', priority = '0.6', image } = opts;

  const imageBlock = image
    ? `
    <image:image>
      <image:loc>${escXml(image.loc)}</image:loc>
      <image:title>${escXml(image.title)}</image:title>
      <image:caption>${escXml(image.caption)}</image:caption>
    </image:image>`
    : '';

  return `
  <url>
    <loc>${DOMAIN}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageBlock}
  </url>`;
}

// ── Build sitemap ─────────────────────────────────────────────────────────

const urls: string[] = [];

// 1. Homepage
urls.push(url('/', { changefreq: 'weekly', priority: '1.0' }));

// 2. Category pages — derived live from CATEGORIES constant
const realCategories = CATEGORIES.filter((c) => c !== 'All');
for (const cat of realCategories) {
  urls.push(url(`/category/${slug(cat)}`, { changefreq: 'weekly', priority: '0.8' }));
}

// 3. Brand pages + per-car pages — derived live from CAR_WALLPAPERS
const brands = [...new Set(CAR_WALLPAPERS.map((c) => c.brand))];

for (const brand of brands) {
  // Brand index page
  urls.push(url(`/brand/${slug(brand)}`, { changefreq: 'weekly', priority: '0.8' }));

  // Individual car pages under this brand
  const brandCars = CAR_WALLPAPERS.filter((c) => c.brand === brand);
  for (const car of brandCars) {
    urls.push(
      url(`/brand/${slug(brand)}/${slug(car.title)}`, {
        changefreq: 'monthly',
        priority: '0.6',
        image: {
          loc: car.imageUrl,
          title: `${car.title} – ${car.brand} ${car.category} 4K Wallpaper`,
          caption: `4K wallpaper of the ${car.brand} ${car.title}. Resolution: ${car.resolution}.`,
        },
      })
    );
  }
}

// ── Write file ────────────────────────────────────────────────────────────

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls.join('')}
</urlset>
`;

writeFileSync('sitemap.xml', sitemap, 'utf-8');

const totalUrls = urls.length;
const totalBrands = brands.length;
const totalCars = CAR_WALLPAPERS.length;

console.log(`✓ sitemap.xml generated`);
console.log(`  ${totalUrls} URLs total`);
console.log(`  ${totalBrands} brand pages`);
console.log(`  ${totalCars} car pages`);
console.log(`  ${realCategories.length} category pages`);
console.log(`  Domain: ${DOMAIN}`);
