/**
 * Services Index - Central export point for all API services
 * Đơn giản hóa chỉ export những gì cần thiết cho OTruyenAPI
 */

// Core API client
export { apiClient } from "./api";

// Service modules
export { mangaService } from "./mangaService";
export { categoryService } from "./categoryService";

// Query client
export { queryClient } from "./queryClient";

// Individual service methods for direct import
export {
  getHome,
  getDanhSach,
  getTheLoai,
  getTruyenTheoTheLoai,
  getTruyenDetail,
  timKiemTruyen,
} from "./mangaService";

export { getCategories, getMangaByCategory } from "./categoryService";

// Service configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const;
