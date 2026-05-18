/**
 * generate-sitemap.ts
 *
 * Produces three files:
 *   sitemap.xml          — sitemap index (points to the two below)
 *   sitemap-desktop.xml  — all desktop wallpaper routes
 *   sitemap-phone.xml    — all phone wallpaper routes
 *
 * Run:  npm run sitemap
 * Auto: runs as part of  npm run build
 */

import { writeFileSync } from 'fs';
import { CAR_WALLPAPERS, CATEGORIES, PHONE_WALLPAPERS } from './src/constants.js';

const DOMAIN = 'https://velocitywallpapers.vercel.app';
const today  = new Date().toISOString().split('T')[0];

// ── Helpers ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function urlEntry(
  loc: string,
  changefreq: string,
  priority: string,
  image?: { loc: string; title: string; caption: string }
): string {
  const img = image
    ? `\n    <image:image>\n      <image:loc>${esc(image.loc)}</image:loc>\n      <image:title>${esc(image.title)}</image:title>\n      <image:caption>${esc(image.caption)}</image:caption>\n    </image:image>`
    : '';
  return `\n  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${img}\n  </url>`;
}

function wrapUrlset(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n>${urls.join('')}\n</urlset>\n`;
}

// ── 1. DESKTOP SITEMAP ────────────────────────────────────────────────────

const desktopUrls: string[] = [];

// Homepage
desktopUrls.push(urlEntry('/', 'weekly', '1.0'));

// Category pages — one per category, with representative image
const realCats = CATEGORIES.filter(c => c !== 'All') as string[];
for (const cat of realCats) {
  const carsInCat = CAR_WALLPAPERS.filter(c => c.category === cat);
  const first     = carsInCat[0];
  desktopUrls.push(
    urlEntry(
      `/category/${slugify(cat)}`,
      'weekly',
      '0.85',
      first
        ? {
            loc:     `${DOMAIN}${first.imageUrl}`,
            title:   `${cat} Car Wallpapers — Velocity`,
            caption: `Browse ${carsInCat.length} premium ${cat} 4K car wallpapers.`,
          }
        : undefined
    )
  );
}

// Brand index pages — alphabetical
const desktopBrands = [...new Set(CAR_WALLPAPERS.map(c => c.brand))].sort();
for (const brand of desktopBrands) {
  const carsForBrand = CAR_WALLPAPERS.filter(c => c.brand === brand);
  const first        = carsForBrand[0];
  desktopUrls.push(
    urlEntry(
      `/brand/${slugify(brand)}`,
      'weekly',
      '0.8',
      first
        ? {
            loc:     `${DOMAIN}${first.imageUrl}`,
            title:   `${brand} Wallpapers — Velocity`,
            caption: `${carsForBrand.length} premium ${brand} 4K wallpapers.`,
          }
        : undefined
    )
  );

  // Individual car pages
  for (const car of carsForBrand) {
    desktopUrls.push(
      urlEntry(
        `/brand/${slugify(brand)}/${car.slug}`,
        'monthly',
        '0.6',
        {
          loc:     `${DOMAIN}${car.imageUrl}`,
          title:   `${car.title} — ${brand} ${car.category} 4K Wallpaper`,
          caption: `Download the ${brand} ${car.title} in 4K. Category: ${car.category}.`,
        }
      )
    );
  }
}

// ── 2. PHONE SITEMAP ──────────────────────────────────────────────────────

const phoneUrls: string[] = [];

// Mobile section index
phoneUrls.push(urlEntry('/', 'weekly', '1.0'));

// Phone brand pages — alphabetical, skip generic 'Mobile'
const phoneBrands = [...new Set(
  PHONE_WALLPAPERS.map(w => w.brand).filter(b => b && b !== 'Mobile')
)].sort();

for (const brand of phoneBrands) {
  const wallsForBrand = PHONE_WALLPAPERS.filter(w => w.brand === brand);
  const first         = wallsForBrand[0];
  phoneUrls.push(
    urlEntry(
      `/mobile/brand/${slugify(brand)}`,
      'weekly',
      '0.75',
      first
        ? {
            loc:     `${DOMAIN}${first.imageUrl}`,
            title:   `${brand} Mobile Wallpapers — Velocity`,
            caption: `${wallsForBrand.length} ${brand} phone wallpapers.`,
          }
        : undefined
    )
  );
}

// Individual phone pages
for (const w of PHONE_WALLPAPERS) {
  phoneUrls.push(
    urlEntry(
      `/phone/${w.slug}`,
      'monthly',
      '0.6',
      {
        loc:     `${DOMAIN}${w.imageUrl}`,
        title:   `${w.title} — Mobile Wallpaper`,
        caption: `Download the ${w.title} phone wallpaper from Velocity.`,
      }
    )
  );
}

// ── 3. SITEMAP INDEX ──────────────────────────────────────────────────────

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-desktop.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-phone.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

// ── Write all three files ─────────────────────────────────────────────────

writeFileSync('sitemap.xml',         sitemapIndex,                 'utf-8');
writeFileSync('sitemap-desktop.xml', wrapUrlset(desktopUrls),      'utf-8');
writeFileSync('sitemap-phone.xml',   wrapUrlset(phoneUrls),        'utf-8');

console.log(`✓ sitemap.xml          — sitemap index`);
console.log(`✓ sitemap-desktop.xml  — ${desktopUrls.length} URLs`);
console.log(`  1 homepage`);
console.log(`  ${realCats.length} category pages (/category/supercar …)`);
console.log(`  ${desktopBrands.length} brand index pages (/brand/ferrari …)`);
console.log(`  ${CAR_WALLPAPERS.length} individual car pages`);
console.log(`✓ sitemap-phone.xml    — ${phoneUrls.length} URLs`);
console.log(`  ${phoneBrands.length} brand pages (/mobile/brand/audi …)`);
console.log(`  ${PHONE_WALLPAPERS.length} individual phone pages`);
console.log(`  Domain: ${DOMAIN}`);
