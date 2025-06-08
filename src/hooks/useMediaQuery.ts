import { useState, useEffect } from 'react';

/**
 * Custom hook for media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Hook to detect mobile devices
 * @returns boolean indicating if the current device is mobile
 */
export const useMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * Hook to detect tablet devices
 * @returns boolean indicating if the current device is tablet
 */
export const useTablet = (): boolean => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

/**
 * Hook to detect desktop devices
 * @returns boolean indicating if the current device is desktop
 */
export const useDesktop = (): boolean => {
  return useMediaQuery('(min-width: 1025px)');
};
