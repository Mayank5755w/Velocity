import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import WallpaperPage from './pages/WallpaperPage';
import PhoneWallpaperPage from './pages/PhoneWallpaperPage';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />} />

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