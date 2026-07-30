import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to synchronize active tab index with window.location.hash.
 * @param slugs Array of URL hash strings corresponding to tab indices 0..N
 * @param defaultIndex Fallback index if no hash or invalid hash is present
 */
export function useHashTab(slugs: string[], defaultIndex = 0) {
  const getIndexFromHash = useCallback((): number => {
    const rawHash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
    if (!rawHash) return defaultIndex;
    const foundIndex = slugs.findIndex((s) => s.toLowerCase() === rawHash);
    return foundIndex >= 0 ? foundIndex : defaultIndex;
  }, [slugs, defaultIndex]);

  const [activeItem, setActiveItemState] = useState<number>(() => getIndexFromHash());

  // Listen for browser back/forward and external hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newIndex = getIndexFromHash();
      setActiveItemState(newIndex);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [getIndexFromHash]);

  // Setter that updates React state and sets window.location.hash
  const setActiveItem = useCallback(
    (index: number) => {
      setActiveItemState(index);
      const slug = slugs[index];
      if (slug && window.location.hash !== `#${slug}`) {
        window.location.hash = slug;
      }
    },
    [slugs]
  );

  return [activeItem, setActiveItem] as const;
}
