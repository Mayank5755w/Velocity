import { writeFileSync, mkdirSync } from 'fs';
import { CAR_WALLPAPERS, PHONE_WALLPAPERS, CATEGORIES } from './src/constants';

const BASE_URL = 'https://velocitywallpapers.vercel.app';

function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

mkdirSync('./public', { recursive: true });

// 1. Gather all URLs into a single list
const urls: string[] = [
  // Static Pages
  `${BASE_URL}/`,
  `${BASE_URL}/desktop`,
  `${BASE_URL}/mobile`,
];

// Categories
CATEGORIES.filter(c => c !== 'All').forEach(cat => {
  urls.push(`${BASE_URL}/category/${toSlug(cat)}`);
});

// Brands
const uniqueBrands = [...new Set(CAR_WALLPAPERS.map(w => w.brand))]
  .filter(b => b !== 'Unknown')
  .sort();

uniqueBrands.forEach(brand => {
  urls.push(`${BASE_URL}/brand/${toSlug(brand)}`);
});

// Desktop Wallpapers
CAR_WALLPAPERS.filter(car => car.brand !== 'Unknown').forEach(car => {
  urls.push(`${BASE_URL}/brand/${toSlug(car.brand)}/${car.slug}`);
});

// Mobile Wallpapers
PHONE_WALLPAPERS.forEach(w => {
  urls.push(`${BASE_URL}/mobile/${w.slug}`);
});

// 2. Clean up any accidental double-spaces or formatting in the URLs
const cleanUrls = urls.map(url => url.replace(/\s+/g, '-').trim());

// 3. Write them to a plain sitemap.txt file (one URL per line)
writeFileSync('./public/sitemap.txt', cleanUrls.join('\n'), 'utf-8');

console.log(`✓ sitemap.txt generated with ${cleanUrls.length} total URLs`);