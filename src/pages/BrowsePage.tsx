import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { MangaGrid } from "../components/common/MangaGrid";
import { HotCategories } from "../components/common/Categories";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useDanhSachQuery, useTheLoaiQuery } from "../hooks/useApiQueries";
import { transformHomeDataToMangaList } from "../utils/dataTransform";
import type { MangaData } from "../components/common/MangaCard";
import {
  getCategoriesForDisplay,
  getFallbackCategories,
} from "../utils/categoryUtils";

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategory } = useParams<{ category?: string }>();

  // Get category from URL params (route or query), default to "action"
  const categoryFromUrl =
    routeCategory || searchParams.get("category") || "action";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryFromUrl);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory !== categoryFromUrl) {
      setSearchParams({ category: selectedCategory });
    }
  }, [selectedCategory, categoryFromUrl, setSearchParams]);

  // Get categories data
  const { data: categoriesData, isLoading: categoriesLoading } =
    useTheLoaiQuery();

  // Use basic API query for manga data
  const {
    data: mangaData,
    isLoading: mangaLoading,
    error: mangaError,
  } = useDanhSachQuery(
    selectedCategory === "all" ? "truyen-moi" : selectedCategory,
    1
  );

  // Transform manga data
  const allMangas = useMemo(() => {
    if (!mangaData?.data) return [];
    const transformedData = transformHomeDataToMangaList(mangaData.data);
    return transformedData.allMangas;
  }, [mangaData]);

  // Transform categories data
  const categories = useMemo(() => {
    if (!categoriesData?.data?.items) {
      return getFallbackCategories();
    }
    return getCategoriesForDisplay(categoriesData);
  }, [categoriesData]);

  // Handle manga click
  const handleMangaClick = useCallback(
    (manga: MangaData) => {
      console.log("Clicked manga:", manga.title, "slug:", manga.slug);
      const mangaIdentifier = encodeURIComponent(manga.slug || manga.id);
      navigate(`/manga/${mangaIdentifier}`);
    },
    [navigate]
  );

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Selected category:", categoryId);
  }, []);

  // Get category display name
  const getCategoryDisplayName = () => {
    if (selectedCategory === "all") return "All Comics";
    const category = categories.find((cat) => cat.id === selectedCategory);
    return (
      category?.name ||
      selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
    );
  };

  // Error state
  if (mangaError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">Error: {mangaError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#1B6FA8] text-white rounded-lg hover:bg-[#1B6FA8]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-[#1B6FA8] hover:text-[#1B6FA8]/80 font-medium transition-colors"
              >
                ← Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Discover Comics - {getCategoryDisplayName()}
              </h1>
            </div>

            {allMangas.length > 0 && (
              <div className="text-sm text-gray-600">
                {allMangas.length} manga found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          {categoriesLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <HotCategories
              categories={[{ id: "all", name: "All Comics" }, ...categories]}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              maxRows={2}
              layout="flex"
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {mangaLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <MangaGrid
              mangas={allMangas}
              onMangaClick={handleMangaClick}
              loading={false}
              columns={{ mobile: 2, tablet: 4, desktop: 5 }}
              cardSize="md"
              className="mb-8"
            />

            {/* Results info */}
            {allMangas.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Showing {allMangas.length} manga in {getCategoryDisplayName()}
                </p>
              </div>
            )}

            {/* No results */}
            {!mangaLoading && allMangas.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No manga found
                </h3>
                <p className="text-gray-500">
                  Try selecting a different category or check back later
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
