import fs from 'fs';
import path from 'path';

const phoneDir = './public/phone';
const constantsFile = './src/constants.ts';

const files = fs.readdirSync(phoneDir);

function makeSlug(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function makeTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

const entries = files.map((file, index) => {

  const title = makeTitle(file);
  const slug = makeSlug(file);

  return `
  {
    id: '${index + 1}',
    title: '${title}',
    slug: '${slug}',
    brand: 'Mobile',
    category: 'Phone',
    imageUrl: '/phone/${file}',
  }`;
});

const constants = fs.readFileSync(constantsFile, 'utf8');

const updated = constants.replace(
  /export const PHONE_WALLPAPERS: PhoneWallpaper\[\] = \[[\s\S]*?\];/,
  `export const PHONE_WALLPAPERS: PhoneWallpaper[] = [${entries.join(',')}];`
);

fs.writeFileSync(constantsFile, updated);

console.log('✓ Phone wallpapers updated');