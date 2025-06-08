import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { mangaService, categoryService } from "../services";

// Query Keys Factory - Đơn giản hóa cho 6 API endpoints
export const queryKeys = {
  // Home
  home: ["home"] as const,

  // Danh sách
  danhSach: (type: string, page?: number) => ["danh-sach", type, page] as const,

  // Thể loại
  theLoai: ["the-loai"] as const,
  truyenTheoTheLoai: (slug: string, page?: number) =>
    ["the-loai", slug, page] as const,

  // Truyện
  truyenDetail: (slug: string) => ["truyen-tranh", slug] as const,

  // Tìm kiếm
  timKiem: (keyword: string) => ["tim-kiem", keyword] as const,

  // Chapter
  chapterData: (chapterApiUrl: string) =>
    ["chapter-data", chapterApiUrl] as const,
} as const;

// API Hooks cho 6 endpoints của OTruyenAPI

// 1. Hook cho GET /home - Thông tin cho trang chủ
export const useHomeQuery = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: () => mangaService.getHome(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Retry 2 lần cho network errors
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("Not Found")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// 2. Hook cho GET /danh-sach/{type} - Trang danh sách truyện theo thể loại
export const useDanhSachQuery = (
  type: string,
  page: number = 1,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.danhSach(type, page),
    queryFn: () => mangaService.getDanhSach(type, page),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("Not Found")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// 3. Hook cho GET /the-loai - Danh sách thể loại truyện
export const useTheLoaiQuery = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.theLoai,
    queryFn: () => mangaService.getTheLoai(),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

// 4. Hook cho GET /the-loai/{slug} - Danh sách truyện theo thể loại
export const useTruyenTheoTheLoaiQuery = (
  slug: string,
  page: number = 1,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.truyenTheoTheLoai(slug, page),
    queryFn: () => mangaService.getTruyenTheoTheLoai(slug, page),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// 5. Hook cho GET /truyen-tranh/{slug} - Thông tin truyện
export const useTruyenDetailQuery = (
  slug: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.truyenDetail(slug),
    queryFn: () => mangaService.getTruyenDetail(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Retry 2 lần cho network errors, không retry cho 404
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("Not Found")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// 6. Hook cho GET /tim-kiem - Tìm kiếm truyện
export const useTimKiemTruyenQuery = (
  keyword: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.timKiem(keyword),
    queryFn: () => mangaService.timKiemTruyen(keyword),
    enabled: !!keyword && keyword.length > 2,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// 7. Hook cho GET chapter data - Lấy dữ liệu chapter
export const useChapterDataQuery = (
  chapterApiUrl: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.chapterData(chapterApiUrl),
    queryFn: () => mangaService.getChapterData(chapterApiUrl),
    enabled: !!chapterApiUrl,
    staleTime: 10 * 60 * 1000, // 10 minutes - chapter data doesn't change often
    ...options,
  });
};

// Chỉ sử dụng 2 hooks cho category service
export const useCategoriesQuery = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.theLoai,
    queryFn: () => categoryService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

export const useMangaByCategory = (
  slug: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.truyenTheoTheLoai(slug),
    queryFn: () => categoryService.getMangaByCategory(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
