import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const BASE_URL = 'https://velocitywallpapers.vercel.app';

export function useSEO({ title, description, ogImage, ogUrl, ogType = 'website' }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    if (ogUrl) setMeta('property', 'og:url', `${BASE_URL}${ogUrl}`);
    if (ogImage) setMeta('property', 'og:image', `${BASE_URL}${ogImage}`);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (ogImage) setMeta('name', 'twitter:image', `${BASE_URL}${ogImage}`);

    // Canonical
    if (ogUrl) setCanonical(`${BASE_URL}${ogUrl}`);
  }, [title, description, ogImage, ogUrl, ogType]);
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
