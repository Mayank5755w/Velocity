/**
 * utils.ts
 * Shared helpers for slugifying and matching brand/category names to URL segments.
 * Centralized here so App.tsx, BrandPage.tsx, CategoryPage.tsx, and WallpaperPage.tsx
 * all use identical, case-safe logic instead of three slightly different inline copies.
 */

/** Converts a display name ("Rolls Royce") into a URL-safe slug ("rolls-royce"). */
export function toSlug(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '-');
}

/** Alias kept for readability at call sites that specifically slugify a category. */
export function categoryToUrl(category: string): string {
  return toSlug(category);
}

/** Alias kept for readability at call sites that specifically slugify a brand. */
export function brandToUrl(brand: string): string {
  return toSlug(brand);
}

/**
 * Finds the canonical, correctly-cased brand name for a given URL slug.
 * Case-insensitive on both sides so /brand/Ferrari and /brand/ferrari both resolve.
 * Returns null if no brand matches.
 */
export function findBrandBySlug(slug: string | undefined, allBrands: string[]): string | null {
  if (!slug) return null;
  const target = slug.toLowerCase();
  return allBrands.find(b => toSlug(b).toLowerCase() === target) ?? null;
}

/**
 * Deterministic shuffle seeded by a string key (e.g. a wallpaper's slug/id).
 * Produces a stable order for a given key across re-renders, but still varies
 * key-to-key, unlike Math.random() which reshuffles on every render.
 */
export function seededShuffle<T>(items: T[], seedKey: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0;
  }

  // xorshift32 PRNG — fast, deterministic, good-enough distribution for shuffling small lists
  function next(): number {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >>> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed / 4294967296;
  }

  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
