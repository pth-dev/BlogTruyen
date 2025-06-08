import { useState, useEffect, useCallback, useRef } from "react";
import { useDanhSachQuery } from "./useApiQueries";
import { transformHomeDataToMangaList } from "../utils/dataTransform";
import type { MangaData } from "../components/common/MangaCard";

interface UseInfiniteScrollOptions {
  type: string;
  maxPages?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  data: MangaData[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => void;
  currentPage: number;
  totalPages: number;
}

export const useInfiniteScroll = ({
  type,
  maxPages = 3,
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState<MangaData[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const loadingRef = useRef(false);

  // Query for current page
  const {
    data: pageData,
    isLoading,
    error,
  } = useDanhSachQuery(type, currentPage, {
    enabled: enabled && currentPage <= maxPages,
  });

  // Transform and accumulate data
  useEffect(() => {
    if (pageData?.data && !loadingRef.current) {
      const transformedData = transformHomeDataToMangaList(pageData.data);
      
      if (currentPage === 1) {
        // First page - replace all data
        setAllData(transformedData.allMangas);
        
        // Calculate total pages from API response, but limit to maxPages
        const apiTotalPages = transformedData.pagination?.totalItems 
          ? Math.ceil(transformedData.pagination.totalItems / (transformedData.pagination.totalItemsPerPage || 24))
          : maxPages;
        setTotalPages(Math.min(apiTotalPages, maxPages));
      } else {
        // Subsequent pages - append data
        setAllData((prevData) => [...prevData, ...transformedData.allMangas]);
      }
      
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [pageData, currentPage, maxPages]);

  // Load more function
  const loadMore = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      !loadingRef.current &&
      currentPage < maxPages &&
      currentPage < totalPages
    ) {
      loadingRef.current = true;
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoading, isLoadingMore, currentPage, maxPages, totalPages]);

  // Auto-load on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
      ) {
        loadMore();
      }
    };

    if (enabled) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loadMore, enabled]);

  // Reset when type changes
  useEffect(() => {
    setCurrentPage(1);
    setAllData([]);
    setIsLoadingMore(false);
    setTotalPages(0);
    loadingRef.current = false;
  }, [type]);

  const hasNextPage = currentPage < Math.min(maxPages, totalPages);

  return {
    data: allData,
    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error,
    hasNextPage,
    loadMore,
    currentPage,
    totalPages: Math.min(maxPages, totalPages),
  };
};
