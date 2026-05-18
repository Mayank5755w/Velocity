import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import WallpaperPage from './pages/WallpaperPage';
import PhoneWallpaperPage from './pages/PhoneWallpaperPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />

  <Route path="/desktop" element={<App />} />

  <Route path="/mobile" element={<App />} />

  <Route
    path="/category/:category"
    element={<CategoryPage />}
  />

  <Route
    path="/brand/:brand"
    element={<BrandPage />}
  />

  <Route
    path="/brand/:brand/:slug"
    element={<WallpaperPage />}
  />

  <Route
    path="/phone/:slug"
    element={<PhoneWallpaperPage />}
  />
</Routes>
    </BrowserRouter>
  </React.StrictMode>
);