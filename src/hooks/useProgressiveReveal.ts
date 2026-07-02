import { useEffect, useRef, useState } from 'react';

/**
 * Renders only a growing "window" of a list instead of mounting every item
 * at once. This is the main lever for grid performance: a 150-wallpaper
 * search result was previously creating 150 <img> elements (and all their
 * layout/paint/decode cost) on first render, even though only ~12 were ever
 * visible on screen. Here we mount an initial batch, then grow the batch via
 * an IntersectionObserver sentinel placed near the bottom of the grid as the
 * user scrolls — classic infinite-scroll, but purely a render-window
 * optimization (no pagination UI, no URL/page-state changes).
 *
 * Resets back to `initialCount` whenever the source list identity/length
 * changes (e.g. a new search query or filter), so filtering always starts
 * from a fast, small batch rather than keeping a huge previous count.
 */
export function useProgressiveReveal<T>(
  items: T[],
  { initialCount = 24, step = 18 }: { initialCount?: number; step?: number } = {}
) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset the window whenever the underlying list changes (new filter/search/category).
  useEffect(() => {
    setVisibleCount(initialCount);
  }, [items, initialCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + step, items.length));
        }
      },
      { rootMargin: '600px 0px' } // start loading the next batch well before it's on screen
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, step]);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    sentinelRef,
  };
}
