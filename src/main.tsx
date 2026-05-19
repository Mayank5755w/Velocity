import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import WallpaperPage from './pages/WallpaperPage';
import PhoneWallpaperPage from './pages/PhoneWallpaperPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import MobilePage from './pages/MobilePage';
import DesktopPage from './pages/DesktopPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home — desktop grid with all filters */}
        <Route path="/" element={<App />} />

        {/* Explicit desktop page (same as home but locked to desktop tab) */}
        <Route path="/desktop" element={<DesktopPage />} />

        {/* Mobile grid page */}
        <Route path="/mobile" element={<MobilePage />} />

        {/* Individual mobile wallpaper detail */}
        <Route path="/mobile/:slug" element={<PhoneWallpaperPage />} />

        {/* Category filtered grid */}
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* Brand filtered grid */}
        <Route path="/brand/:brand" element={<BrandPage />} />

        {/* Individual desktop wallpaper detail */}
        <Route path="/brand/:brand/:slug" element={<WallpaperPage />} />

        {/* Legacy phone route — redirect handled in PhoneWallpaperPage */}
        <Route path="/phone/:slug" element={<PhoneWallpaperPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
