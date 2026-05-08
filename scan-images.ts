/**
 * scan-images.ts
 * 
 * Scans your /public/images/ folder and auto-generates src/constants.ts.
 * Existing entries are preserved — only new files get appended.
 * 
 * Run: npm run scan-images
 */

import { readdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { extname, basename } from 'path';

// ── CONFIG ────────────────────────────────────────────────────────────────

const IMAGES_DIR   = './public/images';
const CONSTANTS_OUT = './src/constants.ts';
const IMAGE_EXTS   = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// ── Brand detection — add more as your collection grows ───────────────────

const BRAND_KEYWORDS: Record<string, string> = {
  ferrari:      'Ferrari',
  lamborghini:  'Lamborghini',
  porsche:      'Porsche',
  bugatti:      'Bugatti',
  mclaren:      'McLaren',
  bentley:      'Bentley',
  rollsroyce:   'Rolls Royce',
  'rolls-royce':'Rolls Royce',
  mercedes:     'Mercedes',
  bmw:          'BMW',
  audi:         'Audi',
  lexus:        'Lexus',
  toyota:       'Toyota',
  honda:        'Honda',
  nissan:       'Nissan',
  mazda:        'Mazda',
  subaru:       'Subaru',
  mitsubishi:   'Mitsubishi',
  ford:         'Ford',
  dodge:        'Dodge',
  chevrolet:    'Chevrolet',
  corvette:     'Chevrolet',
  astonmartin:  'Aston Martin',
  'aston-martin':'Aston Martin',
  landrovertd:  'Land Rover',
  landrover:    'Land Rover',
  pagani:       'Pagani',
  koenigsegg:   'Koenigsegg',
  rimac:        'Rimac',
  maserati:     'Maserati',
  alfa:         'Alfa Romeo',
};

// ── Category detection ────────────────────────────────────────────────────

type Category = 'Supercar' | 'Hypercar' | 'Classic' | 'Off-road' | 'Luxury' | 'JDM' | 'Motor Sport';

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: Category }> = [
  { keywords: ['hypercar','chiron','veyron','koenigsegg','pagani','rimac','laferrari','p1','918'],    category: 'Hypercar' },
  { keywords: ['499p','motorsport','motor-sport','lmp','gt3','racing','race','rally','lemans'],       category: 'Motor Sport' },
  { keywords: ['jdm','rx7','rx-7','supra','gtr','gt-r','skyline','nsx','s2000','ae86','brz','350z','370z','evo','wrx','silvia'], category: 'JDM' },
  { keywords: ['gwagon','g-wagon','defender','wrangler','offroad','off-road','4x4','suv','land','patrol'], category: 'Off-road' },
  { keywords: ['phantom','ghost','cullinan','flying-spur','flyingspur','continental','mulsanne','bentayga','s-class','7series','a8','ls500'], category: 'Luxury' },
  { keywords: ['classic','vintage','retro','muscle','cobra','mustang','camaro','charger','challenger','gto','550','250gto'], category: 'Classic' },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function detectBrand(filename: string): string {
  const lower = filename.toLowerCase().replace(/[\s_.-]+/g, '');
  for (const [key, brand] of Object.entries(BRAND_KEYWORDS)) {
    if (lower.includes(key.replace(/[\s-]/g, ''))) return brand;
  }
  return 'Unknown';
}

function detectCategory(filename: string): Category {
  const lower = filename.toLowerCase();
  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return category;
  }
  return 'Supercar'; // sensible default
}

function makeTitle(filename: string): string {
  // Strip extension, replace separators with spaces, title-case each word
  return basename(filename, extname(filename))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function parseExistingConstants(content: string): {
  entries: Array<{ id: string; imageUrl: string; [key: string]: string }>;
  maxId: number;
} {
  const entries: Array<{ id: string; imageUrl: string; [key: string]: string }> = [];
  let maxId = 0;

  // Match each object block inside CAR_WALLPAPERS
  const blockRegex = /\{([^}]+)\}/g;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[1];
    const obj: Record<string, string> = {};
    const fieldRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(block)) !== null) {
      obj[fieldMatch[1]] = fieldMatch[2];
    }
    if (obj.id && obj.imageUrl) {
      entries.push(obj as { id: string; imageUrl: string });
      const numId = parseInt(obj.id, 10);
      if (!isNaN(numId) && numId > maxId) maxId = numId;
    }
  }

  return { entries, maxId };
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  // 1. Scan image folder
  if (!existsSync(IMAGES_DIR)) {
    console.error(`✗ Folder not found: ${IMAGES_DIR}`);
    console.error(`  Create it and put your images inside.`);
    process.exit(1);
  }

  const allFiles = readdirSync(IMAGES_DIR);
  const imageFiles = allFiles.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log(`✓ No image files found in ${IMAGES_DIR}`);
    process.exit(0);
  }

  console.log(`✓ Found ${imageFiles.length} image file(s) in ${IMAGES_DIR}`);

  // 2. Parse existing constants (if any) to avoid duplicates
  let existingEntries: Array<{ id: string; imageUrl: string; [key: string]: string }> = [];
  let nextId = 1;

  if (existsSync(CONSTANTS_OUT)) {
    
    const existing = readFileSync(CONSTANTS_OUT, 'utf-8');
    const parsed = parseExistingConstants(existing);
    existingEntries = parsed.entries;
    nextId = parsed.maxId + 1;
    console.log(`✓ Found ${existingEntries.length} existing entries in constants.ts`);
  }

  const existingUrls = new Set(existingEntries.map(e => e.imageUrl));

  // 3. Build new entries for images not already in constants
  const newEntries: Array<{
    id: string; title: string; brand: string;
    category: Category; imageUrl: string;
  }> = [];

  let skipped = 0;
  for (const file of imageFiles) {
    const imageUrl = `images/${file}`;
    if (existingUrls.has(imageUrl)) {
      skipped++;
      continue;
    }

    newEntries.push({
      id: String(nextId++),
      title: makeTitle(file),
      brand: detectBrand(file),
      category: detectCategory(file),
      imageUrl,
    });
  }

  if (skipped > 0) console.log(`  ${skipped} file(s) already in constants.ts — skipped`);
  if (newEntries.length === 0) {
    console.log(`✓ No new images to add. constants.ts is up to date.`);
    process.exit(0);
  }

  console.log(`  ${newEntries.length} new entry/entries to add`);

  // 4. Merge all entries (existing + new) and write constants.ts
  const allEntries = [...existingEntries, ...newEntries];

  const entryStrings = allEntries.map(e => {
    // Handle both old entries (arbitrary fields) and new typed entries
    const id       = e.id       || '';
    const title    = e.title    || '';
    const brand    = e.brand    || '';
    const category = e.category || '';
    const imageUrl = e.imageUrl || '';

    return `  {
    id: '${id}',
    title: '${title.replace(/'/g, "\\'")}',
    brand: '${brand.replace(/'/g, "\\'")}',
    category: '${category}',
    imageUrl: '${imageUrl}',
  }`;
  }).join(',\n');

  const output = `export interface CarWallpaper {
  id: string;
  title: string;
  brand: string;
  category: 'Supercar' | 'Hypercar' | 'Classic' | 'Off-road' | 'Luxury' | 'JDM' | 'Motor Sport';
  imageUrl: string;
}

export const CAR_WALLPAPERS: CarWallpaper[] = [
${entryStrings}
];

export const CATEGORIES = ['All', 'Supercar', 'Hypercar', 'Classic', 'Off-road', 'Luxury', 'JDM', 'Motor Sport'] as const;
`;

  writeFileSync(CONSTANTS_OUT, output, 'utf-8');

  console.log(`\n✓ constants.ts updated — ${allEntries.length} total entries`);
  if (newEntries.length > 0) {
    console.log(`\nNew entries added:`);
    newEntries.forEach(e => {
      const brandOk = e.brand !== 'Unknown' ? '✓' : '⚠';
      console.log(`  ${brandOk} [${e.id}] ${e.title} — ${e.brand} / ${e.category}`);
    });
    console.log(`\n  ⚠  Review entries marked with ⚠ — brand not auto-detected from filename.`);
    console.log(`     Edit the title/brand in src/constants.ts if needed.`);
  }
}

// ── Node doesn't support top-level await in .ts without async wrapper ─────
(async () => { await main(); })();
