import { apiClient } from "./api";

/**
 * Manga Service - Handles all manga-related API calls
 * Đơn giản hóa chỉ sử dụng 6 endpoints cơ bản của OTruyenAPI
 */
export class MangaService {
  /**
   * 1. GET /home - Thông tin cho trang chủ
   */
  async getHome(): Promise<any> {
    return apiClient.getHome();
  }

  /**
   * 2. GET /danh-sach/{type} - Trang danh sách truyện theo thể loại
   */
  async getDanhSach(type: string, page: number = 1): Promise<any> {
    return apiClient.getDanhSach(type, page);
  }

  /**
   * 3. GET /the-loai - Danh sách thể loại truyện
   */
  async getTheLoai(): Promise<any> {
    return apiClient.getTheLoai();
  }

  /**
   * 4. GET /the-loai/{slug} - Danh sách truyện theo thể loại
   */
  async getTruyenTheoTheLoai(slug: string, page: number = 1): Promise<any> {
    return apiClient.getTruyenTheoTheLoai(slug, page);
  }

  /**
   * 5. GET /truyen-tranh/{slug} - Thông tin truyện
   */
  async getTruyenDetail(slug: string): Promise<any> {
    return apiClient.getTruyenDetail(slug);
  }

  /**
   * 6. GET /tim-kiem - Tìm kiếm truyện
   */
  async timKiemTruyen(keyword: string): Promise<any> {
    return apiClient.timKiemTruyen(keyword);
  }

  /**
   * 7. GET chapter data - Lấy dữ liệu chapter từ chapter_api_data URL
   */
  async getChapterData(chapterApiUrl: string): Promise<any> {
    return apiClient.getChapterData(chapterApiUrl);
  }
}

// Export singleton instance
export const mangaService = new MangaService();

// Export individual methods for direct use
export const {
  getHome,
  getDanhSach,
  getTheLoai,
  getTruyenTheoTheLoai,
  getTruyenDetail,
  timKiemTruyen,
  getChapterData,
} = mangaService;
