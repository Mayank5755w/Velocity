import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Mounted once in main.tsx's AppRouter. Scrolls to top on every route change,
 * so individual pages (WallpaperPage, PhoneWallpaperPage, BrandPage, etc.)
 * no longer need their own window.scrollTo(0,0) useEffect.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
