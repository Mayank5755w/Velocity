import fs from 'fs';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS } from './src/constants';

const DOMAIN = 'https://velocitywallpapers.vercel.app';

const categories = [
  'supercar',
  'hypercar',
  'classic',
  'off-road',
  'luxury',
  'jdm',
  'motor-sport',
];

const brands = [
  ...new Set(
    CAR_WALLPAPERS.map(w =>
      w.brand.toLowerCase().replace(/\s+/g, '-')
    )
  ),
];

function makeUrl(loc: string) {
  return `
  <url>
    <loc>${DOMAIN}${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

const desktopUrls = CAR_WALLPAPERS.map(w =>
  makeUrl(
    `/brand/${w.brand.toLowerCase().replace(/\s+/g, '-')}/${w.slug}`
  )
).join('');

const mobileUrls = PHONE_WALLPAPERS.map(w =>
  makeUrl(`/phone/${w.slug}`)
).join('');

const categoryUrls = categories
  .map(c => makeUrl(`/category/${c}`))
  .join('');

const brandUrls = brands
  .map(b => makeUrl(`/brand/${b}`))
  .join('');

function wrap(content: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content}
</urlset>`;
}

fs.writeFileSync(
  './public/sitemap-desktop.xml',
  wrap(desktopUrls)
);

fs.writeFileSync(
  './public/sitemap-mobile.xml',
  wrap(mobileUrls)
);

fs.writeFileSync(
  './public/sitemap-categories.xml',
  wrap(categoryUrls)
);

fs.writeFileSync(
  './public/sitemap-brands.xml',
  wrap(brandUrls)
);

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<sitemap>
<loc>${DOMAIN}/sitemap-desktop.xml</loc>
</sitemap>

<sitemap>
<loc>${DOMAIN}/sitemap-mobile.xml</loc>
</sitemap>

<sitemap>
<loc>${DOMAIN}/sitemap-categories.xml</loc>
</sitemap>

<sitemap>
<loc>${DOMAIN}/sitemap-brands.xml</loc>
</sitemap>

</sitemapindex>`;

fs.writeFileSync('./public/sitemap.xml', sitemapIndex);

console.log('All sitemaps generated.');