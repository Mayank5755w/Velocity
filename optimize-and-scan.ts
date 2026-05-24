// optimize-and-scan.ts
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const CONSTANTS_FILE = './src/constants.ts';
const CAR_DIR = './public/images';
const PHONE_DIR = './public/phone';
const SOURCE_EXTS = ['.jpg', '.jpeg', '.png'];

interface RawItem {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  imageUrl: string;
  downloadUrl?: string;
}

// Convert files to WebP dynamically
async function ensureWebp(dirPath: string, file: string): Promise<string> {
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const destWebpName = `${baseName}.webp`;
  const destWebpPath = path.join(dirPath, destWebpName);
  const sourcePath = path.join(dirPath, file);

  if (!fs.existsSync(destWebpPath)) {
    console.log(`⚡ Converting: ${file} -> ${destWebpName}`);
    await sharp(sourcePath).webp({ quality: 85 }).toFile(destWebpPath);
  }
  return destWebpName;
}

// Extract base name of files to match uniquely on disk
function getFileBaseName(url: string | undefined): string | null {
  if (!url) return null;
  const filename = path.basename(url);
  const ext = path.extname(filename);
  return path.basename(filename, ext);
}

// Parse existing array blocks from constants.ts
function parseArray(content: string, arrayName: string): RawItem[] {
  const regex = new RegExp(`export const ${arrayName}: \\w+\\s*\\[\\] = \\s*\\[([\\s\\S]*?)\\];`);
  const match = content.match(regex);
  if (!match) return [];

  const block = match[1];
  const itemRegex = /\{([\s\S]*?)\}/g;
  const items: RawItem[] = [];

  let m;
  while ((m = itemRegex.exec(block)) !== null) {
    const fieldsText = m[1];
    const item: any = {};
    
    const idM = fieldsText.match(/id:\s*['"]([^'"]+)['"]/);
    const titleM = fieldsText.match(/title:\s*['"]([^'"]+)['"]/);
    const slugM = fieldsText.match(/slug:\s*['"]([^'"]+)['"]/);
    const brandM = fieldsText.match(/brand:\s*['"]([^'"]+)['"]/);
    const catM = fieldsText.match(/category:\s*['"]([^'"]+)['"]/);
    const imgM = fieldsText.match(/imageUrl:\s*['"]([^'"]+)['"]/);
    const downM = fieldsText.match(/downloadUrl:\s*['"]([^'"]+)['"]/);

    if (idM) item.id = idM[1];
    if (titleM) item.title = titleM[1];
    if (slugM) item.slug = slugM[1];
    if (brandM) item.brand = brandM[1];
    if (catM) item.category = catM[1];
    if (imgM) item.imageUrl = imgM[1];
    if (downM) item.downloadUrl = downM[1];

    if (item.slug) {
      items.push(item);
    }
  }
  return items;
}

async function run() {
  console.log('--- Running Deduplication & Image Optimization Pipeline ---');

  if (!fs.existsSync(CONSTANTS_FILE)) {
    console.error('constants.ts file not found.');
    return;
  }

  const fileContent = fs.readFileSync(CONSTANTS_FILE, 'utf-8');

  const existingCars = parseArray(fileContent, 'CAR_WALLPAPERS');
  const existingPhones = parseArray(fileContent, 'PHONE_WALLPAPERS');

  // Key existing items by their physical, unique disk filename to prevent duplicates
  const carMap = new Map<string, RawItem>();
  for (const item of existingCars) {
    const base = getFileBaseName(item.downloadUrl) || getFileBaseName(item.imageUrl);
    if (base) carMap.set(base, item);
  }

  const phoneMap = new Map<string, RawItem>();
  for (const item of existingPhones) {
    const base = getFileBaseName(item.downloadUrl) || getFileBaseName(item.imageUrl);
    if (base) phoneMap.set(base, item);
  }

  if (fs.existsSync(CAR_DIR)) {
    const files = fs.readdirSync(CAR_DIR);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (SOURCE_EXTS.includes(ext)) {
        const webpName = await ensureWebp(CAR_DIR, file);
        const base = path.basename(file, ext);
        
        if (!carMap.has(base)) {
          const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          carMap.set(base, {
            id: '',
            title: base.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug,
            brand: 'Unknown',
            category: 'Supercar',
            imageUrl: `/images/${webpName}`,
            downloadUrl: `/images/${file}`
          });
        } else {
          const existing = carMap.get(base)!;
          existing.imageUrl = `/images/${webpName}`;
          existing.downloadUrl = `/images/${file}`;
        }
      }
    }
  }

  if (fs.existsSync(PHONE_DIR)) {
    const files = fs.readdirSync(PHONE_DIR);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (SOURCE_EXTS.includes(ext)) {
        const webpName = await ensureWebp(PHONE_DIR, file);
        const base = path.basename(file, ext);

        if (!phoneMap.has(base)) {
          const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          phoneMap.set(base, {
            id: '',
            title: base.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug,
            brand: 'Mobile',
            category: 'Supercar',
            imageUrl: `/phone/${webpName}`,
            downloadUrl: `/phone/${file}`
          });
        } else {
          const existing = phoneMap.get(base)!;
          existing.imageUrl = `/phone/${webpName}`;
          existing.downloadUrl = `/phone/${file}`;
        }
      }
    }
  }

  // Clean sequential IDs
  let idCounter = 1;
  const cleanCars = Array.from(carMap.values()).map(item => ({
    ...item,
    id: String(idCounter++)
  }));

  idCounter = 1; // sequentially index phone wallpapers starting from 1
  const cleanPhones = Array.from(phoneMap.values()).map(item => ({
    ...item,
    id: String(idCounter++)
  }));

  const carBlock = cleanCars.map(c => `  {
    id: '${c.id}',
    title: '${c.title.replace(/'/g, "\\'")}',
    slug: '${c.slug}',
    brand: '${c.brand}',
    category: '${c.category}',
    imageUrl: '${c.imageUrl}',
    downloadUrl: '${c.downloadUrl || ''}',
  }`).join(',\n');

  const phoneBlock = cleanPhones.map(p => `  {
    id: '${p.id}',
    title: '${p.title.replace(/'/g, "\\'")}',
    slug: '${p.slug}',
    brand: '${p.brand}',
    category: '${p.category}',
    imageUrl: '${p.imageUrl}',
    downloadUrl: '${p.downloadUrl || ''}',
  }`).join(',\n');

  const output = `export interface CarWallpaper {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: 'Supercar' | 'Hypercar' | 'Classic' | 'Off-road' | 'Luxury' | 'JDM' | 'Motor Sport';
  imageUrl: string;
  downloadUrl?: string;
}
export interface PhoneWallpaper {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  imageUrl: string;
  downloadUrl?: string;
}

export const CAR_WALLPAPERS: CarWallpaper[] = [
${carBlock}
];

export const CATEGORIES = ['All', 'Supercar', 'Hypercar', 'Classic', 'Off-road', 'Luxury', 'JDM', 'Motor Sport'] as const;

export const PHONE_WALLPAPERS: PhoneWallpaper[] = [
${phoneBlock}
];
`;

  fs.writeFileSync(CONSTANTS_FILE, output, 'utf-8');
  console.log(`✓ Completed Optimization: ${cleanCars.length} Desktops, ${cleanPhones.length} Mobiles successfully registered.`);
}

run();