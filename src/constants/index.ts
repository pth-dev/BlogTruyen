// App constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || "BlogTruyen";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CDN_DOMAIN = import.meta.env.VITE_CDN_DOMAIN;

// UI Configuration
export const UI_CONFIG = {
  HERO_BANNER_HEIGHT: parseInt(import.meta.env.VITE_HERO_BANNER_HEIGHT) || 20,
  MANGA_GRID: {
    MOBILE: parseInt(import.meta.env.VITE_MANGA_GRID_MOBILE) || 2,
    TABLET: parseInt(import.meta.env.VITE_MANGA_GRID_TABLET) || 4,
    DESKTOP: parseInt(import.meta.env.VITE_MANGA_GRID_DESKTOP) || 5,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
    MAX_PAGES_INFINITE_SCROLL:
      parseInt(import.meta.env.VITE_MAX_PAGES_INFINITE_SCROLL) || 3,
  },
  SEARCH: {
    MIN_LENGTH: parseInt(import.meta.env.VITE_MIN_SEARCH_LENGTH) || 3,
    DEBOUNCE_MS: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 500,
  },
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLOR: import.meta.env.VITE_PRIMARY_COLOR || "#1B6FA8",
  ACCENT_COLOR: import.meta.env.VITE_ACCENT_COLOR || "#F4B333",
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  QUERY_STALE_TIME: parseInt(import.meta.env.VITE_QUERY_STALE_TIME) || 300000, // 5 minutes
  QUERY_CACHE_TIME: parseInt(import.meta.env.VITE_QUERY_CACHE_TIME) || 600000, // 10 minutes
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
} as const;

// Manga statuses (used in MangaCard component)
export const MANGA_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  HIATUS: "hiatus",
  CANCELLED: "cancelled",
} as const;

// Supported languages (used in i18n)
export const LANGUAGES = {
  EN: "en",
  VI: "vi",
} as const;
