import fs from 'fs';
import { PHONE_WALLPAPERS } from './src/constants';

const DOMAIN = 'https://velocitywallpapers.vercel.app';

const urls = PHONE_WALLPAPERS.map((wallpaper) => `
  <url>
    <loc>${DOMAIN}/phone/${wallpaper.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('./public/phone-sitemap.xml', sitemap);

console.log('phone-sitemap.xml generated');