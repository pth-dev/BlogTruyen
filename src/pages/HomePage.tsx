import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AutoSlideHeroBanner } from "../components/common/AutoSlideHeroBanner";
import { HotCategories } from "../components/common/Categories";
import { MangaGrid } from "../components/common/MangaGrid";
import { Pagination } from "../components/common/Pagination";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import type { MangaData } from "../components/common/MangaCard";
import type { PaginationInfo } from "../components/common/Pagination";
import {
  useHomeQuery,
  useTheLoaiQuery,
  useDanhSachQuery,
} from "../hooks/useApiQueries";
import {
  transformHomeDataToMangaList,
  transformMangaToHeroBannerItems,
} from "../utils/dataTransform";
import {
  getCategoriesForDisplay,
  getFallbackCategories,
} from "../utils/categoryUtils";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all-category");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Use simple TanStack Query loading
  const {
    data: homeData,
    isLoading: homeLoading,
    error: homeError,
  } = useHomeQuery();
  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    error: paginatedError,
  } = useDanhSachQuery("truyen-moi", currentPage);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useTheLoaiQuery();

  // Define handleMangaClick first using useCallback
  const handleMangaClick = useCallback(
    (manga: MangaData) => {
      // Navigate to manga detail page using the manga slug - encode để tránh lỗi routing
      const mangaIdentifier = encodeURIComponent(manga.slug || manga.id);
      navigate(`/manga/${mangaIdentifier}`);
    },
    [navigate]
  );

  // Transform home API data for hero banner
  const transformedHomeData = useMemo(() => {
    if (!homeData?.data) return null;
    return transformHomeDataToMangaList(homeData.data);
  }, [homeData]);

  // Transform paginated API data for main manga listing
  const transformedPaginatedData = useMemo(() => {
    if (!paginatedData?.data) return null;
    return transformHomeDataToMangaList(paginatedData.data);
  }, [paginatedData]);

  // Generate hero banner items from home API data (24 items)
  const heroBannerItems = useMemo(() => {
    if (!transformedHomeData?.allMangas) return [];

    return transformMangaToHeroBannerItems(
      transformedHomeData.allMangas, // Use all 24 items from home API
      handleMangaClick // Pass click handler
    );
  }, [transformedHomeData, handleMangaClick]);

  // Transform categories data and limit to 2 rows
  const categories = useMemo(() => {
    if (!categoriesData?.data?.items) {
      // Fallback to static data if API fails
      return getFallbackCategories();
    }

    // Transform API categories and limit for 2 rows
    return getCategoriesForDisplay(categoriesData);
  }, [categoriesData]);

  // Extract manga data from paginated API response
  const allMangas = transformedPaginatedData?.allMangas || [];

  // Extract pagination info from paginated API response
  const paginationInfo: PaginationInfo | null = useMemo(() => {
    if (!paginatedData?.data?.params?.pagination) return null;

    const pagination = paginatedData.data.params.pagination;
    return {
      totalItems: pagination.totalItems,
      totalItemsPerPage: pagination.totalItemsPerPage,
      currentPage: pagination.currentPage,
      pageRanges: pagination.pageRanges || 5,
    };
  }, [paginatedData]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      // Navigate to category page if not "all-category"
      if (categoryId !== "all-category") {
        navigate(`/category/${categoryId}`);
      }
    },
    [navigate]
  );

  // Simple error handling
  if (paginatedError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">Error: {paginatedError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#E40066] text-white rounded-lg hover:bg-[#c1005a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      {homeLoading ? (
        <div className="h-[20vh] bg-gray-100 rounded-lg mx-4 my-4 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <AutoSlideHeroBanner
          items={heroBannerItems}
          height="xs"
          autoSlideInterval={10000}
          itemsPerSlide={10}
          onItemClick={(item, index) => {
            if (item.onClick) {
              item.onClick();
            }
          }}
        />
      )}

      {/* Categories Section */}
      <div className="hidden lg:block px-4 lg:px-6">
        {categoriesLoading ? (
          <div className="py-4 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <HotCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            maxRows={2}
            layout="flex"
            className="w-full"
          />
        )}
      </div>

      {/* Latest Manga Section */}
      <div className="bg-[#1F1F1F] p-4 lg:px-6">
        {paginatedLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <MangaGrid
              title="Latest"
              titleHighlight="Manga"
              mangas={allMangas}
              onMangaClick={handleMangaClick}
              loading={false}
              columns={{ mobile: 2, tablet: 4, desktop: 5 }}
              cardSize="md"
              titleClassName="text-white"
            />

            {/* Pagination */}
            {paginationInfo && (
              <div className="mt-8">
                <Pagination
                  pagination={paginationInfo}
                  onPageChange={handlePageChange}
                  className="text-white"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
