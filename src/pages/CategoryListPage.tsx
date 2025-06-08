import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTruyenTheoTheLoaiQuery } from "../hooks/useApiQueries";
import { MangaGrid } from "../components/common/MangaGrid";
import { Pagination } from "../components/common/Pagination";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import type { MangaData } from "../components/common/MangaCard";
import { transformOTruyenMangaToMangaData } from "../utils/dataTransform";
import { AlertCircle } from "lucide-react";

export const CategoryListPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when slug changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  // Simple TanStack Query
  const { data, isLoading, error } = useTruyenTheoTheLoaiQuery(
    slug || "",
    currentPage
  );

  // Transform data
  const transformedData = useMemo(() => {
    if (!data?.data) return null;

    const cdnDomain =
      data.data.APP_DOMAIN_CDN_IMAGE || "https://img.otruyenapi.com";
    const mangas =
      data.data.items?.map((item: any) =>
        transformOTruyenMangaToMangaData(item, cdnDomain)
      ) || [];

    return {
      mangas,
      pagination: data.data.params?.pagination,
      categoryName:
        data.data.titlePage || slug?.replace("-", " ") || "Category",
    };
  }, [data, slug]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMangaClick = (manga: MangaData) => {
    console.log("Navigate to manga:", manga.title, "slug:", manga.slug);
    // Navigate to manga detail page using slug or id - encode để tránh lỗi routing
    const mangaIdentifier = encodeURIComponent(manga.slug || manga.id);
    navigate(`/manga/${mangaIdentifier}`);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Không cần early return loading - sử dụng CategoryListLoader
  // Chỉ hiển thị error khi thực sự có lỗi

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">Error: {error.message}</p>
          <button
            onClick={handleBackToHome}
            className="px-6 py-2 bg-[#E40066] text-white rounded-lg hover:bg-[#c1005a] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!transformedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No manga found
          </h2>
          <p className="text-gray-600 mb-4">
            This category doesn't have any manga yet.
          </p>
          <button
            onClick={handleBackToHome}
            className="px-6 py-2 bg-[#E40066] text-white rounded-lg hover:bg-[#c1005a] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { mangas, pagination, categoryName } = transformedData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="text-[#E40066] hover:text-[#c1005a] font-medium transition-colors"
              >
                ← Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {transformedData?.categoryName || slug}
              </h1>
            </div>

            {transformedData?.pagination && (
              <div className="text-sm text-gray-600">
                {transformedData.pagination.totalItems.toLocaleString()} manga
                found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content with Category Loading */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : transformedData ? (
          <>
            {/* Manga Grid */}
            <MangaGrid
              mangas={transformedData.mangas}
              onMangaClick={handleMangaClick}
              columns={{ mobile: 2, tablet: 4, desktop: 5 }}
              cardSize="md"
              className="mb-8"
            />

            {/* Pagination */}
            {transformedData.pagination && (
              <Pagination
                pagination={transformedData.pagination}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No manga found
            </h2>
            <p className="text-gray-600 mb-4">
              This category doesn't have any manga yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
