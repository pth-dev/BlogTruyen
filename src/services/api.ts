// Base API configuration
const BaseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * Simple API Client for OTruyenAPI
 * Chỉ có 6 endpoints cơ bản không cần authentication
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Core request method đơn giản
  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // 1. GET /home - Thông tin cho trang chủ
  async getHome(): Promise<any> {
    return this.request("/home");
  }

  // 2. GET /danh-sach/{type} - Trang danh sách truyện theo thể loại
  async getDanhSach(type: string, page: number = 1): Promise<any> {
    return this.request(`/danh-sach/${type}?page=${page}`);
  }

  // 3. GET /the-loai - Danh sách thể loại truyện
  async getTheLoai(): Promise<any> {
    return this.request("/the-loai");
  }

  // 4. GET /the-loai/{slug} - Danh sách truyện theo thể loại
  async getTruyenTheoTheLoai(slug: string, page: number = 1): Promise<any> {
    return this.request(`/the-loai/${slug}?page=${page}`);
  }

  // 5. GET /truyen-tranh/{slug} - Thông tin truyện
  async getTruyenDetail(slug: string): Promise<any> {
    return this.request(`/truyen-tranh/${slug}`);
  }

  // 6. GET /tim-kiem - Tìm kiếm truyện
  async timKiemTruyen(keyword: string): Promise<any> {
    return this.request(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
  }

  // 7. GET chapter data from external chapter_api_data URL
  async getChapterData(chapterApiUrl: string): Promise<any> {
    try {
      // Make direct request to the external chapter API URL
      const response = await fetch(chapterApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      throw error;
    }
  }
}

// Export API client instance
export const apiClient = new ApiClient(BaseURL);
