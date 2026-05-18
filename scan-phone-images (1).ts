/**
 * scan-phone-images.ts
 *
 * Safely scans /public/phone/ and appends NEW entries to PHONE_WALLPAPERS
 * in src/constants.ts WITHOUT touching CAR_WALLPAPERS or any other export.
 *
 * Run: npm run scan-phone
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { extname, basename } from 'path';

// ── CONFIG ────────────────────────────────────────────────────────────────
const PHONE_DIR     = './public/phone';
const CONSTANTS_OUT = './src/constants.ts';
const IMAGE_EXTS    = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// ── Brand detection for phone wallpapers ─────────────────────────────────
const BRAND_KEYWORDS: Record<string, string> = {
  ferrari:        'Ferrari',
  lamborghini:    'Lamborghini',
  porsche:        'Porsche',
  bugatti:        'Bugatti',
  mclaren:        'McLaren',
  bentley:        'Bentley',
  rollsroyce:     'Rolls Royce',
  'rolls-royce':  'Rolls Royce',
  mercedes:       'Mercedes',
  bmw:            'BMW',
  audi:           'Audi',
  toyota:         'Toyota',
  honda:          'Honda',
  nissan:         'Nissan',
  mazda:          'Mazda',
  subaru:         'Subaru',
  ford:           'Ford',
  dodge:          'Dodge',
  chevrolet:      'Chevrolet',
  corvette:       'Chevrolet',
  astonmartin:    'Aston Martin',
  'aston-martin': 'Aston Martin',
  pagani:         'Pagani',
  koenigsegg:     'Koenigsegg',
  lamborghini2:   'Lamborghini',
};

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['hypercar','chiron','veyron','koenigsegg','pagani','p1','918','zonda','huayra'], category: 'Hypercar' },
  { keywords: ['motorsport','racing','race','rally','formula','f1','gt3','gt4'],               category: 'Motor Sport' },
  { keywords: ['jdm','rx7','rx-7','supra','gtr','gt-r','skyline','nsx','brz','wrx','sti','impreza','supra'], category: 'JDM' },
  { keywords: ['classic','vintage','retro','muscle','countach','db5'],                          category: 'Classic' },
  { keywords: ['phantom','ghost','cullinan','phantom','spectre','continental'],                 category: 'Luxury' },
];

function detectBrand(filename: string): string {
  const lower = filename.toLowerCase().replace(/[\s_.-]+/g, '');
  for (const [key, brand] of Object.entries(BRAND_KEYWORDS)) {
    if (lower.includes(key.replace(/[\s-]/g, ''))) return brand;
  }
  return 'Unknown';
}

function detectCategory(filename: string): string {
  const lower = filename.toLowerCase();
  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return category;
  }
  return 'Supercar';
}

function makeTitle(filename: string): string {
  return basename(filename, extname(filename))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSlug(filename: string, index: number, existingSlugs: Set<string>): string {
  let base = basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  let slug = base;
  let counter = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter++}`;
  }
  existingSlugs.add(slug);
  return slug;
}

// ── Extract existing imageUrls already in PHONE_WALLPAPERS block only ─────
function getExistingPhoneUrls(content: string): Set<string> {
  const phoneMatch = content.match(/export const PHONE_WALLPAPERS[\s\S]*?= \[([\s\S]*?)\];/);
  if (!phoneMatch) return new Set();
  const urls = new Set<string>();
  const urlRegex = /imageUrl:\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(phoneMatch[1])) !== null) urls.add(m[1]);
  return urls;
}

// ── Extract existing slugs from PHONE_WALLPAPERS only ────────────────────
function getExistingPhoneSlugs(content: string): Set<string> {
  const phoneMatch = content.match(/export const PHONE_WALLPAPERS[\s\S]*?= \[([\s\S]*?)\];/);
  if (!phoneMatch) return new Set();
  const slugs = new Set<string>();
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = slugRegex.exec(phoneMatch[1])) !== null) slugs.add(m[1]);
  return slugs;
}

// ── Get the highest numeric id across ALL entries in the file ─────────────
function getMaxId(content: string): number {
  let max = 0;
  const idRegex = /\bid:\s*['"](\d+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = idRegex.exec(content)) !== null) {
    const n = parseInt(m[1], 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return max;
}

// ── Main ──────────────────────────────────────────────────────────────────
function main() {
  if (!existsSync(PHONE_DIR)) {
    console.error(`✗ Folder not found: ${PHONE_DIR}`);
    process.exit(1);
  }

  if (!existsSync(CONSTANTS_OUT)) {
    console.error(`✗ constants.ts not found at ${CONSTANTS_OUT}`);
    process.exit(1);
  }

  const allFiles   = readdirSync(PHONE_DIR);
  const imageFiles = allFiles.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log(`✓ No images found in ${PHONE_DIR}`);
    return;
  }

  console.log(`✓ Found ${imageFiles.length} phone image file(s) in ${PHONE_DIR}`);

  const content       = readFileSync(CONSTANTS_OUT, 'utf-8');
  const existingUrls  = getExistingPhoneUrls(content);
  const existingSlugs = getExistingPhoneSlugs(content);
  let   nextId        = getMaxId(content) + 1;

  console.log(`✓ ${existingUrls.size} existing PHONE entries detected`);

  // Build new entries
  const newEntries: string[] = [];
  let skipped = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const file     = imageFiles[i];
    const imageUrl = `/phone/${file}`;
    if (existingUrls.has(imageUrl)) { skipped++; continue; }

    const slug  = makeSlug(file, i, existingSlugs);
    const brand = detectBrand(file);
    const cat   = detectCategory(file);

    newEntries.push(
`  {
    id: '${nextId++}',
    title: '${makeTitle(file).replace(/'/g, "\\'")}',
    slug: '${slug}',
    brand: '${brand === 'Unknown' ? 'Mobile' : brand}',
    category: '${cat}',
    imageUrl: '${imageUrl}',
  }`
    );
  }

  if (skipped > 0) console.log(`  ${skipped} file(s) already in PHONE_WALLPAPERS — skipped`);

  if (newEntries.length === 0) {
    console.log(`✓ No new phone images to add. constants.ts is up to date.`);
    return;
  }

  // Surgically inject into PHONE_WALLPAPERS — find its closing ]; 
  // We look for the end of the PHONE_WALLPAPERS array (last ]; in the file or end of file)
  const injection = newEntries.join(',\n') + ',\n';

  // Replace the closing ]; of PHONE_WALLPAPERS (it's the last array in the file)
  const updated = content.replace(
    /(export const PHONE_WALLPAPERS[\s\S]*?)\];(\s*)$/,
    (_, arrayBody, trailing) => `${arrayBody},\n${injection}];${trailing}`
  );

  if (updated === content) {
    console.error('✗ Could not find PHONE_WALLPAPERS injection point. Check file structure.');
    process.exit(1);
  }

  writeFileSync(CONSTANTS_OUT, updated, 'utf-8');

  console.log(`\n✓ constants.ts updated — ${newEntries.length} new PHONE_WALLPAPERS entry/entries added`);
  console.log(`✓ CAR_WALLPAPERS untouched`);
  console.log(`\nNew entries:`);
  newEntries.forEach(e => {
    const title = (e.match(/title: '([^']+)'/) || [])[1] || '?';
    const brand = (e.match(/brand: '([^']+)'/) || [])[1] || '?';
    console.log(`  ✓ ${title} — ${brand}`);
  });
}

main();
