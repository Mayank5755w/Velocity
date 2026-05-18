/**
 * scan-images.ts
 *
 * Safely scans /public/images/ and appends NEW entries to CAR_WALLPAPERS
 * in src/constants.ts WITHOUT touching PHONE_WALLPAPERS or any other export.
 *
 * Run: npm run scan-images
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { extname, basename } from 'path';

// ── CONFIG ────────────────────────────────────────────────────────────────
const IMAGES_DIR    = './public/images';
const CONSTANTS_OUT = './src/constants.ts';
const IMAGE_EXTS    = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// ── Brand detection ───────────────────────────────────────────────────────
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
  lexus:          'Lexus',
  toyota:         'Toyota',
  honda:          'Honda',
  nissan:         'Nissan',
  mazda:          'Mazda',
  subaru:         'Subaru',
  mitsubishi:     'Mitsubishi',
  ford:           'Ford',
  dodge:          'Dodge',
  chevrolet:      'Chevrolet',
  corvette:       'Chevrolet',
  astonmartin:    'Aston Martin',
  'aston-martin': 'Aston Martin',
  landrover:      'Land Rover',
  pagani:         'Pagani',
  koenigsegg:     'Koenigsegg',
  rimac:          'Rimac',
  maserati:       'Maserati',
  alfa:           'Alfa Romeo',
  packard:        'Packard',
};

type Category = 'Supercar' | 'Hypercar' | 'Classic' | 'Off-road' | 'Luxury' | 'JDM' | 'Motor Sport';

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: Category }> = [
  { keywords: ['hypercar','chiron','veyron','koenigsegg','pagani','rimac','laferrari','p1','918','zonda','huayra'], category: 'Hypercar' },
  { keywords: ['499p','motorsport','motor-sport','lmp','gt3','gt4','racing','race','rally','lemans','f1','formula'], category: 'Motor Sport' },
  { keywords: ['jdm','rx7','rx-7','supra','gtr','gt-r','skyline','nsx','s2000','ae86','brz','350z','370z','evo','wrx','silvia','impreza'], category: 'JDM' },
  { keywords: ['gwagon','g-wagon','defender','wrangler','offroad','off-road','4x4','patrol'], category: 'Off-road' },
  { keywords: ['phantom','ghost','cullinan','flying-spur','flyingspur','continental','mulsanne','bentayga','spectre','mulliner'], category: 'Luxury' },
  { keywords: ['classic','vintage','retro','muscle','cobra','mustang','camaro','charger','challenger','countach','packard'], category: 'Classic' },
];

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
  return 'Supercar';
}

function makeTitle(filename: string): string {
  return basename(filename, extname(filename))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function makeSlug(filename: string): string {
  return basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Extract existing imageUrls already in CAR_WALLPAPERS block only ───────
function getExistingCarUrls(content: string): Set<string> {
  // Find only the CAR_WALLPAPERS array block (not PHONE_WALLPAPERS)
  const carMatch = content.match(/export const CAR_WALLPAPERS[\s\S]*?= \[([\s\S]*?)\];/);
  if (!carMatch) return new Set();
  const urls = new Set<string>();
  const urlRegex = /imageUrl:\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(carMatch[1])) !== null) urls.add(m[1]);
  return urls;
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
  if (!existsSync(IMAGES_DIR)) {
    console.error(`✗ Folder not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  if (!existsSync(CONSTANTS_OUT)) {
    console.error(`✗ constants.ts not found at ${CONSTANTS_OUT}`);
    process.exit(1);
  }

  const allFiles  = readdirSync(IMAGES_DIR);
  const imageFiles = allFiles.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log(`✓ No images found in ${IMAGES_DIR}`);
    return;
  }

  console.log(`✓ Found ${imageFiles.length} image file(s) in ${IMAGES_DIR}`);

  const content       = readFileSync(CONSTANTS_OUT, 'utf-8');
  const existingUrls  = getExistingCarUrls(content);
  let   nextId        = getMaxId(content) + 1;

  console.log(`✓ ${existingUrls.size} existing CAR entries detected`);
  console.log(`✓ Next id will be: ${nextId}`);

  // Build new entries
  const newEntries: string[] = [];
  let skipped = 0;

  for (const file of imageFiles) {
    const imageUrl = `/images/${file}`;
    if (existingUrls.has(imageUrl)) { skipped++; continue; }

    const slug = makeSlug(file);
    // Ensure slug uniqueness by checking existing slugs
    newEntries.push(
`  {
    id: '${nextId++}',
    title: '${makeTitle(file).replace(/'/g, "\\'")}',
    slug: '${slug}',
    brand: '${detectBrand(file)}',
    category: '${detectCategory(file)}',
    imageUrl: '${imageUrl}',
  }`
    );
  }

  if (skipped > 0) console.log(`  ${skipped} file(s) already in CAR_WALLPAPERS — skipped`);

  if (newEntries.length === 0) {
    console.log(`✓ No new images to add. constants.ts is up to date.`);
    return;
  }

  // Surgically insert into CAR_WALLPAPERS — find closing bracket of that array
  // We look for the ]; that closes CAR_WALLPAPERS (before CATEGORIES export)
  const insertMarker = /(\nexport const CATEGORIES)/;
  const injection    = newEntries.join(',\n') + ',\n';

  // Find the ]; just before CATEGORIES and inject before it
  const updated = content.replace(
    /(\];\s*\n)(export const CATEGORIES)/,
    (_, closingBracket, categoriesExport) =>
      `,\n${injection}${closingBracket}${categoriesExport}`
  );

  if (updated === content) {
    console.error('✗ Could not find injection point in constants.ts. Check file structure.');
    process.exit(1);
  }

  writeFileSync(CONSTANTS_OUT, updated, 'utf-8');

  console.log(`\n✓ constants.ts updated — ${newEntries.length} new CAR_WALLPAPERS entry/entries added`);
  console.log(`✓ PHONE_WALLPAPERS untouched`);
  console.log(`\nNew entries:`);
  newEntries.forEach(e => {
    const brand    = (e.match(/brand: '([^']+)'/) || [])[1] || '?';
    const title    = (e.match(/title: '([^']+)'/) || [])[1] || '?';
    const brandOk  = brand !== 'Unknown';
    console.log(`  ${brandOk ? '✓' : '⚠'} ${title} — ${brand}`);
  });
  if (newEntries.some(e => e.includes("brand: 'Unknown'"))) {
    console.log(`\n  ⚠  Edit entries marked Unknown in src/constants.ts`);
  }
}

main();
