import { apiClient } from "./api";

/**
 * Category/Genre interface for OTruyenAPI
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

/**
 * Category Service - Handles all category/genre-related API calls
 * Đơn giản hóa chỉ sử dụng API endpoints cơ bản
 */
export class CategoryService {
  /**
   * Get all available categories/genres
   */
  async getCategories(): Promise<any> {
    return apiClient.getTheLoai();
  }

  /**
   * Get manga by category
   */
  async getMangaByCategory(categorySlug: string): Promise<any> {
    return apiClient.getTruyenTheoTheLoai(categorySlug);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

// Export individual methods for direct use
export const { getCategories, getMangaByCategory } = categoryService;
