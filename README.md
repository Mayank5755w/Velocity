# Velocity Wallpapers — bug fix patch

This is a drop-in replacement for the files listed below. Copy each file into
the matching path in your project (overwriting the existing one), then add
`.env.example` → `.env` and fill in real values.

## How to apply
1. Copy `src/*` from this patch into your project's `src/` folder, preserving
   the `components/` and `pages/` subfolders (two new files, `utils.ts` and
   `components/PageHeader.tsx`, `components/ScrollToTop.tsx`,
   `components/DownloadButton.tsx`, did not exist before — they're new).
2. Copy `.env.example` to your project root, rename to `.env`, fill in your
   real UPI ID / Ko-fi link / Google client ID / Web3Forms key / social URLs.
3. Add the same keys in Vercel → Project Settings → Environment Variables.
4. `npm run build` as usual.

## Files changed
- `src/App.tsx`
- `src/Footer.tsx`
- `src/main.tsx`
- `src/constants.ts`
- `src/utils.ts` *(new)*
- `src/components/PageHeader.tsx` *(new)*
- `src/components/ScrollToTop.tsx` *(new)*
- `src/components/DownloadButton.tsx` *(new)*
- `src/pages/AboutPage.tsx`
- `src/pages/BrandPage.tsx`
- `src/pages/CategoryPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/DMCAPage.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/WallpaperPage.tsx`
- `src/pages/PhoneWallpaperPage.tsx`

## What was fixed

**Security**
- UPI ID and Ko-fi link were hardcoded in `App.tsx` — moved to
  `VITE_UPI_ID` / `VITE_KOFI_LINK` env vars (`.env.example` added).
- Google sign-in (`useGoogleLogin`) call sites are now guarded by
  `hasGoogleAuth`, so the button is hidden instead of throwing when
  `VITE_GOOGLE_CLIENT_ID` is missing.

**Bugs**
- Multi-word brand names (e.g. "Rolls Royce") produced broken URLs
  everywhere `brand.toLowerCase()` was used directly instead of slugifying
  spaces to hyphens — fixed across `App.tsx`, `BrandPage.tsx`,
  `CategoryPage.tsx`, and `WallpaperPage.tsx` via a shared `brandToUrl()`
  helper in the new `utils.ts`.
- `WallpaperPage.tsx`'s brand lookup didn't lowercase the URL param itself,
  so mixed-case brand links (`/brand/Ferrari/...`) could 404 — fixed via the
  new `findBrandBySlug()` helper, matching the safer pattern `BrandPage.tsx`
  already used.
- "Related/similar wallpapers" on `WallpaperPage.tsx` and
  `PhoneWallpaperPage.tsx` used `Math.random()` inside `.sort()`, which is
  non-deterministic and could reshuffle the list on every re-render — replaced
  with a deterministic `seededShuffle()` keyed on the wallpaper's id/slug.
- `PrivacyPage.tsx`'s cookie preference toggles updated state but the "Save
  Preferences" button had no handler — it's now wired to persist to
  `localStorage` and shows a brief "Preferences Saved" confirmation.
- Fixed an invalid Tailwind class typo (`text-zinc-505`) in `App.tsx`'s hero
  heading that silently failed to apply any color.
- The right-sidebar user avatar in `App.tsx` was missing
  `referrerPolicy="no-referrer"` (present on the mobile drawer's avatar but
  not this one) — Google profile photos can fail to load without it.

**iOS download UX**
- iOS Safari ignores the `download` attribute for these static images and
  just opens them in a new tab. There's no reliable client-side fix on static
  hosting, so the new `components/DownloadButton.tsx` detects iOS and shows a
  one-line instruction ("press and hold, then Add to Photos") after the user
  taps download.

**Code quality / duplication**
- Extracted `PageHeader` (logo + back link) used identically across
  `AboutPage`, `ContactPage`, `DMCAPage`, `PrivacyPage`, and `TermsPage` into
  one shared component (`src/components/PageHeader.tsx`).
- Extracted `categoryToUrl()` / `brandToUrl()` / `findBrandBySlug()`, each
  previously duplicated (with subtle inconsistencies) across `App.tsx`,
  `BrandPage.tsx`, and `CategoryPage.tsx`, into `src/utils.ts`.
- Added a global `<ScrollToTop />` mounted once in `main.tsx`, removing the
  per-page `window.scrollTo` `useEffect` from `WallpaperPage.tsx` and
  `PhoneWallpaperPage.tsx`.

**Routing & content**
- `Footer.tsx`'s "Desktop" link now points to `/desktop` (the canonical route
  used in the sitemap) instead of `/`.
- Footer social icons (Instagram/X/YouTube) now read from
  `VITE_INSTAGRAM_URL` / `VITE_TWITTER_URL` / `VITE_YOUTUBE_URL` and only
  render when a real URL is configured, instead of always linking to `#`.
- `WallpaperPage.tsx`'s "About" and "Heritage" sections now check for an
  optional `description` / `heritage` field on the wallpaper (added to the
  `CarWallpaper` interface in `constants.ts`) before falling back to the
  previous generic templated copy — lets you add real per-car copy
  incrementally without breaking existing entries.

## Not changed
`optimize-and-scan.ts`'s `downloadUrl` intentionally still points at the
original, uncompressed image rather than the WebP — that's correct behavior
(downloads should stay full quality), just worth knowing it's deliberate, not
a leftover bug.
