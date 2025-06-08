import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import {
  useChapterDataQuery,
  useTruyenDetailQuery,
} from "../hooks/useApiQueries";
import { useMobile } from "../hooks/useMediaQuery";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Settings,
  Maximize,
  Minimize,
  List,
  SkipBack,
  SkipForward,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ReaderPageProps {}

export const ReaderPage: React.FC<ReaderPageProps> = () => {
  const { chapterApiUrl } = useParams<{ chapterApiUrl: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile detection
  const isMobile = useMobile();

  // Get manga slug from location state or URL
  const mangaSlug =
    location.state?.mangaSlug ||
    new URLSearchParams(location.search).get("manga");

  // Decode the chapter API URL from the route parameter
  const decodedChapterApiUrl = chapterApiUrl
    ? decodeURIComponent(chapterApiUrl)
    : "";

  // State management
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [readingMode, setReadingMode] = useState<
    "single" | "double" | "webtoon"
  >(isMobile ? "webtoon" : "single"); // Force webtoon mode on mobile
  const [pageFit, setPageFit] = useState<"width" | "height" | "auto">("width");
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<number, boolean>
  >({});
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Refs for image preloading and scroll behavior
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const preloadQueue = useRef<string[]>([]);
  const lastTapTimeRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simple TanStack Query
  const {
    data: chapterData,
    isLoading: chapterLoading,
    error: chapterError,
  } = useChapterDataQuery(decodedChapterApiUrl);
  const {
    data: mangaData,
    isLoading: mangaLoading,
    error: mangaError,
  } = useTruyenDetailQuery(mangaSlug || "");

  // Extract chapter and manga info
  const chapter = chapterData?.data?.item;
  const manga = mangaData?.data?.item;

  // Image preloading function
  const preloadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCache.current.set(src, img);
        setPreloadedImages((prev) => new Set(prev).add(src));
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Preload adjacent images for smooth navigation
  const preloadAdjacentImages = useCallback(
    (
      currentIndex: number,
      images: any[],
      cdnDomain: string,
      chapterPath: string
    ) => {
      const preloadRange = 3; // Preload 3 images before and after current
      const toPreload: string[] = [];

      for (
        let i = Math.max(0, currentIndex - preloadRange);
        i <= Math.min(images.length - 1, currentIndex + preloadRange);
        i++
      ) {
        if (images[i]) {
          const imageUrl = `${cdnDomain}/${chapterPath}/${images[i].image_file}`;
          if (!preloadedImages.has(imageUrl)) {
            toPreload.push(imageUrl);
          }
        }
      }

      // Preload images in background
      toPreload.forEach((url) => {
        preloadImage(url).catch(console.error);
      });
    },
    [preloadImage, preloadedImages]
  );

  // Force webtoon mode on mobile
  useEffect(() => {
    if (isMobile && readingMode !== "webtoon") {
      setReadingMode("webtoon");
    }
  }, [isMobile, readingMode]);

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Keyboard navigation - Disabled on mobile for webtoon mode
  useEffect(() => {
    if (isMobile) return; // Disable keyboard navigation on mobile

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          previousPage();
          break;
        case "ArrowRight":
          nextPage();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isFullscreen, isMobile]);

  const totalPages = chapterData?.data?.item?.chapter_image?.length || 0;

  // Get current chapter info and chapter list
  const currentChapter = chapterData?.data?.item;
  const allChapters = mangaData?.data?.item?.chapters?.[0]?.server_data || [];
  const currentChapterIndex = allChapters.findIndex(
    (ch: any) => ch.chapter_api_data === decodedChapterApiUrl
  );

  // Chapter navigation functions
  const goToChapter = useCallback(
    (chapterApiUrl: string) => {
      const encodedUrl = encodeURIComponent(chapterApiUrl);
      const searchParams = mangaSlug ? `?manga=${mangaSlug}` : "";
      navigate(`/reader/${encodedUrl}${searchParams}`, {
        state: { mangaSlug },
      });
    },
    [navigate, mangaSlug]
  );

  const goToPreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      goToChapter(prevChapter.chapter_api_data);
    }
  }, [currentChapterIndex, allChapters, goToChapter]);

  const goToNextChapter = useCallback(() => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      goToChapter(nextChapter.chapter_api_data);
    }
  }, [currentChapterIndex, allChapters, goToChapter]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      setShowControls(true);
    } else if (currentChapterIndex < allChapters.length - 1) {
      // Auto-advance to next chapter
      goToNextChapter();
    }
  }, [
    currentPage,
    totalPages,
    currentChapterIndex,
    allChapters.length,
    goToNextChapter,
  ]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setShowControls(true);
    } else if (currentChapterIndex > 0) {
      // Auto-go to previous chapter (last page)
      goToPreviousChapter();
    }
  }, [currentPage, currentChapterIndex, goToPreviousChapter]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      setShowControls(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Handle scroll behavior for mobile
  const handleScroll = useCallback(() => {
    if (!isMobile) return;

    const currentScrollY = window.scrollY;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);

    // Show scroll to top button when scrolled down
    setShowScrollToTop(currentScrollY > 300);

    // Only react to significant scroll movements (avoid micro-scrolls)
    if (scrollDifference > 5) {
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide controls
        setShowControls(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show controls immediately
        setShowControls(true);
      }
    }

    setLastScrollY(currentScrollY);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Auto-hide controls after 4 seconds of no scrolling (only if scrolled down)
    scrollTimeoutRef.current = setTimeout(() => {
      if (currentScrollY > 50) {
        setShowControls(false);
      }
    }, 4000);
  }, [isMobile, lastScrollY]);

  // Handle double tap to show/hide controls
  const handleDoubleTap = useCallback(() => {
    if (!isMobile) return;

    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    if (timeDiff < 400) {
      // Double tap detected - toggle controls
      setShowControls((prev) => !prev);

      // Clear any existing auto-hide timeout when manually toggling
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // If showing controls, set a longer timeout before auto-hide
      if (!showControls) {
        scrollTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 6000);
      }
    }

    lastTapTimeRef.current = now;
  }, [isMobile, showControls]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add scroll listener for mobile
  useEffect(() => {
    if (isMobile) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isMobile, handleScroll]);

  // Preload images when chapter data changes or current page changes
  useEffect(() => {
    if (chapterData?.data?.item) {
      const chapter = chapterData.data.item;
      const images = chapter.chapter_image || [];
      const cdnDomain = chapterData.data.domain_cdn || "";
      const chapterPath = chapter.chapter_path || "";

      preloadAdjacentImages(currentPage, images, cdnDomain, chapterPath);
    }
  }, [chapterData, currentPage, preloadAdjacentImages]);

  // Reset page when chapter changes
  useEffect(() => {
    setCurrentPage(0);
    setImageLoadingStates({});
    // Clear image cache for memory management
    if (imageCache.current.size > 50) {
      imageCache.current.clear();
      setPreloadedImages(new Set());
    }
  }, [decodedChapterApiUrl]);

  // Không cần early return loading - sử dụng Progressive Loading
  // Chỉ hiển thị error khi thực sự có lỗi (không phải đang loading)

  // Loading state
  if (chapterLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-4">Loading chapter...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (chapterError || (!chapterLoading && !chapterData?.data?.item)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
          <p className="text-gray-300 mb-6">
            The chapter you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ReaderContent
      chapterData={chapterData}
      mangaData={mangaData}
      isFullscreen={isFullscreen}
      showControls={showControls}
      handleMouseMove={handleMouseMove}
      handleDoubleTap={handleDoubleTap}
      currentPage={currentPage}
      totalPages={totalPages}
      readingMode={readingMode}
      setReadingMode={setReadingMode}
      pageFit={pageFit}
      imageLoadingStates={imageLoadingStates}
      setImageLoadingStates={setImageLoadingStates}
      showChapterList={showChapterList}
      setShowChapterList={setShowChapterList}
      showScrollToTop={showScrollToTop}
      isMobile={isMobile}
      allChapters={allChapters}
      currentChapterIndex={currentChapterIndex}
      goToPreviousChapter={goToPreviousChapter}
      goToNextChapter={goToNextChapter}
      goToChapter={goToChapter}
      previousPage={previousPage}
      nextPage={nextPage}
      goToPage={goToPage}
      toggleFullscreen={toggleFullscreen}
      scrollToTop={scrollToTop}
      navigate={navigate}
    />
  );
};

// Tách content thành component riêng để dễ quản lý
const ReaderContent: React.FC<{
  chapterData: any;
  mangaData: any;
  isFullscreen: boolean;
  showControls: boolean;
  handleMouseMove: any;
  handleDoubleTap: any;
  currentPage: number;
  totalPages: number;
  readingMode: string;
  setReadingMode: any;
  pageFit: string;
  imageLoadingStates: any;
  setImageLoadingStates: any;
  showChapterList: boolean;
  setShowChapterList: any;
  showScrollToTop: boolean;
  isMobile: boolean;
  allChapters: any[];
  currentChapterIndex: number;
  goToPreviousChapter: any;
  goToNextChapter: any;
  goToChapter: any;
  previousPage: any;
  nextPage: any;
  goToPage: any;
  toggleFullscreen: any;
  scrollToTop: any;
  navigate: any;
}> = ({
  chapterData,
  isFullscreen,
  showControls,
  handleMouseMove,
  handleDoubleTap,
  currentPage,
  totalPages,
  readingMode,
  setReadingMode,
  pageFit,
  imageLoadingStates,
  setImageLoadingStates,
  showChapterList,
  setShowChapterList,
  showScrollToTop,
  isMobile,
  allChapters,
  currentChapterIndex,
  goToPreviousChapter,
  goToNextChapter,
  goToChapter,
  previousPage,
  nextPage,
  goToPage,
  toggleFullscreen,
  scrollToTop,
  navigate,
}) => {
  const chapter = chapterData.data.item;
  const images = chapter.chapter_image || [];
  const cdnDomain = chapterData.data.domain_cdn || "";
  const chapterPath = chapter.chapter_path || "";

  return (
    <div
      className={`min-h-screen bg-black text-white relative ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Header Controls */}
      <div
        className={`fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-3 md:p-4 transition-all duration-300 ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Back</span>
            </Button>
            <div className="text-sm min-w-0 flex-1">
              <h1 className="font-semibold text-white truncate text-xs md:text-sm">
                {chapter.comic_name}
              </h1>
              <p className="text-gray-300 truncate text-xs">
                Chapter {chapter.chapter_name}
                {chapter.chapter_title && ` - ${chapter.chapter_title}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Chapter Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousChapter}
              disabled={currentChapterIndex <= 0}
              className="text-white hover:bg-white/20 disabled:opacity-50 p-2"
              title="Previous Chapter"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextChapter}
              disabled={currentChapterIndex >= allChapters.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-50 p-2"
              title="Next Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Chapter List Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChapterList(!showChapterList)}
              className="text-white hover:bg-white/20 p-2"
              title="Chapter List"
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 p-2"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Reading Area */}
      <div
        className={`flex items-center justify-center min-h-screen ${
          isMobile ? "p-0" : "p-4"
        }`}
        onClick={handleDoubleTap}
      >
        {readingMode === "single" && (
          <div className="relative max-w-full max-h-full">
            {images[currentPage] && (
              <img
                src={`${cdnDomain}/${chapterPath}/${images[currentPage].image_file}`}
                alt={`Page ${currentPage + 1}`}
                className={`max-w-full max-h-screen object-contain transition-opacity duration-200 ${
                  pageFit === "width"
                    ? "w-full"
                    : pageFit === "height"
                    ? "h-screen"
                    : "max-w-full max-h-full"
                } ${
                  imageLoadingStates[currentPage] ? "opacity-50" : "opacity-100"
                }`}
                onLoad={() => {
                  setImageLoadingStates((prev) => ({
                    ...prev,
                    [currentPage]: false,
                  }));
                }}
                onLoadStart={() => {
                  setImageLoadingStates((prev) => ({
                    ...prev,
                    [currentPage]: true,
                  }));
                }}
                onError={(e) => {
                  setImageLoadingStates((prev) => ({
                    ...prev,
                    [currentPage]: false,
                  }));
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x1200?text=Image+Not+Found";
                }}
                loading="eager"
                decoding="async"
              />
            )}

            {/* Navigation Areas - Only on desktop */}
            {!isMobile && (
              <>
                <div
                  className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
                  onClick={previousPage}
                />
                <div
                  className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
                  onClick={nextPage}
                />
              </>
            )}
          </div>
        )}

        {readingMode === "webtoon" && (
          <div className="w-full max-w-4xl">
            {images.map((image, index) => (
              <img
                key={index}
                src={`${cdnDomain}/${chapterPath}/${image.image_file}`}
                alt={`Page ${index + 1}`}
                className={`w-full mb-2 transition-opacity duration-200 ${
                  imageLoadingStates[index] ? "opacity-50" : "opacity-100"
                }`}
                onLoad={() => {
                  setImageLoadingStates((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                }}
                onLoadStart={() => {
                  setImageLoadingStates((prev) => ({ ...prev, [index]: true }));
                }}
                onError={(e) => {
                  setImageLoadingStates((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x1200?text=Image+Not+Found";
                }}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4 transition-all duration-300 ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Navigation - Hidden on mobile for webtoon mode */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousPage}
                disabled={currentPage === 0}
                className="text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="text-white hover:bg-white/20 disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Page Slider - Removed page info display */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                title={`Page ${currentPage + 1} of ${totalPages}`}
              />
            </div>
          )}

          {/* Reading Mode Toggle - Hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant={readingMode === "single" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReadingMode("single")}
                className="text-white hover:bg-white/20"
              >
                Single
              </Button>
              <Button
                variant={readingMode === "webtoon" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReadingMode("webtoon")}
                className="text-white hover:bg-white/20"
              >
                Webtoon
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chapter List Overlay */}
      {showChapterList && (
        <div className="fixed inset-0 bg-black/80 z-20 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Chapters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChapterList(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {allChapters
                .slice()
                .reverse()
                .map((chapter: any, index: number) => {
                  // Calculate the original index for comparison with currentChapterIndex
                  const originalIndex = allChapters.length - 1 - index;
                  const isCurrentChapter =
                    originalIndex === currentChapterIndex;

                  return (
                    <div
                      key={chapter.chapter_api_data}
                      className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors ${
                        isCurrentChapter
                          ? "bg-brand-primary/20 border-brand-primary"
                          : ""
                      }`}
                      onClick={() => {
                        goToChapter(chapter.chapter_api_data);
                        setShowChapterList(false);
                      }}
                    >
                      <div className="text-white font-medium">
                        Chapter {chapter.chapter_name}
                      </div>
                      {chapter.chapter_title && (
                        <div className="text-gray-400 text-sm truncate">
                          {chapter.chapter_title}
                        </div>
                      )}
                      {isCurrentChapter && (
                        <div className="text-brand-primary text-xs mt-1">
                          Currently Reading
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button - Mobile Only */}
      {isMobile && showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 z-30 bg-brand-primary hover:bg-brand-primary/80 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          title="Scroll to Top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Loading overlay for page changes */}
      {readingMode === "single" && imageLoadingStates[currentPage] && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};
