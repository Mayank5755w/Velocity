import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the provider

import App from './App';
import WallpaperPage from './pages/WallpaperPage';
import PhoneWallpaperPage from './pages/PhoneWallpaperPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import MobilePage from './pages/MobilePage';
import DesktopPage from './pages/DesktopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import DMCAPage from './pages/DMCAPage';
import PrivacyPage from './pages/PrivacyPage';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          {/* ── Core pages ── */}
          <Route path="/" element={<App />} />
          <Route path="/desktop" element={<DesktopPage />} />
          <Route path="/mobile" element={<MobilePage />} />

          {/* ── Wallpaper detail pages ── */}
          <Route path="/mobile/:slug" element={<PhoneWallpaperPage />} />
          <Route path="/brand/:brand/:slug" element={<WallpaperPage />} />

          {/* ── Filtered grids ── */}
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/brand/:brand" element={<BrandPage />} />

          {/* ── Info & Legal pages ── */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/dmca" element={<DMCAPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* ── Legacy route ── */}
          <Route path="/phone/:slug" element={<PhoneWallpaperPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);