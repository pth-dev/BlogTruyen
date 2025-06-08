import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";

interface MangaItem {
  id: string;
  title: string;
  slug?: string;
  imageUrl: string;
  onClick?: () => void;
}

interface AutoSlideHeroBannerProps {
  items: MangaItem[];
  height?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  onItemClick?: (item: MangaItem, index: number) => void;
  autoSlideInterval?: number; // milliseconds
  itemsPerSlide?: number;
}

const heightClasses = {
  xs: "h-auto", // Extra small - compact height
  sm: "h-auto", // Small height
  md: "h-auto", // Medium height
  lg: "h-auto", // Large height
  xl: "h-auto", // Extra large height
};

export const AutoSlideHeroBanner: React.FC<AutoSlideHeroBannerProps> = ({
  items,
  height = "xs",
  className,
  onItemClick,
  autoSlideInterval = 10000, // 10 seconds
  itemsPerSlide = 10, // Default for desktop, will be adjusted for mobile
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Responsive items per slide
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Adjust items per slide based on screen size
  const actualItemsPerSlide = isMobile ? 6 : itemsPerSlide; // 3 cols x 2 rows = 6 on mobile

  // Create infinite loop data - duplicate items to ensure we always have enough for full slides
  const infiniteItems = React.useMemo(() => {
    if (items.length === 0) return [];

    // If we have fewer items than actualItemsPerSlide, repeat the array until we have enough
    if (items.length < actualItemsPerSlide) {
      const repeats = Math.ceil(actualItemsPerSlide / items.length);
      return Array.from({ length: repeats }, () => items).flat();
    }

    // For infinite scrolling, we need to duplicate the array to ensure smooth transitions
    // We'll create enough items for seamless looping
    const totalItemsNeeded = Math.max(
      items.length * 2,
      actualItemsPerSlide * 3
    );
    const repeats = Math.ceil(totalItemsNeeded / items.length);
    return Array.from({ length: repeats }, () => items).flat();
  }, [items, actualItemsPerSlide]);

  // Calculate total slides based on original items length for proper cycling
  const totalSlides = Math.max(
    1,
    Math.ceil(items.length / actualItemsPerSlide)
  );

  // Auto slide functionality with infinite loop
  useEffect(() => {
    if (items.length <= actualItemsPerSlide) return; // Don't auto-slide if we have only one slide worth of items

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [totalSlides, autoSlideInterval, items.length, actualItemsPerSlide]);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = items
        .filter((item) => item.imageUrl && !loadedImages.has(item.imageUrl))
        .map((item) => {
          return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(item.imageUrl);
            img.onerror = () => reject(item.imageUrl);
            img.src = item.imageUrl;
          });
        });

      try {
        const loaded = await Promise.allSettled(imagePromises);
        const successfullyLoaded = loaded
          .filter(
            (result): result is PromiseFulfilledResult<string> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        if (successfullyLoaded.length > 0) {
          setLoadedImages((prev) => new Set([...prev, ...successfullyLoaded]));
        }
      } catch (error) {
        console.warn("Some hero banner images failed to preload:", error);
      }
    };

    if (items.length > 0) {
      preloadImages();
    }
  }, [items, loadedImages]);

  const handleItemClick = (item: MangaItem, index: number) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  if (!items.length) return null;

  // Get current slide items using infinite items array
  // Always ensure we have exactly actualItemsPerSlide items
  const getCurrentSlideItems = () => {
    const startIndex = currentSlideIndex * actualItemsPerSlide;
    let currentItems = infiniteItems.slice(
      startIndex,
      startIndex + actualItemsPerSlide
    );

    // If we don't have enough items (shouldn't happen with infinite array, but safety check)
    if (currentItems.length < actualItemsPerSlide && items.length > 0) {
      // Fill remaining slots by cycling through original items
      const remaining = actualItemsPerSlide - currentItems.length;
      for (let i = 0; i < remaining; i++) {
        currentItems.push(items[i % items.length]);
      }
    }

    return currentItems;
  };

  const currentItems = getCurrentSlideItems();

  return (
    <div className={cn("w-full", className)}>
      {/* Grid Hero Banner with minimal padding */}
      <div className="p-2 lg:p-4">
        <div
          className={cn(
            "grid gap-1.5 lg:gap-2 rounded-lg overflow-hidden",
            heightClasses[height],
            // Responsive grid layout:
            // Mobile: 3 cols x 2 rows = 6 items
            // Desktop: 5 cols x 2 rows = 10 items
            isMobile ? "grid-cols-3 grid-rows-2" : "grid-cols-5 grid-rows-2",
            // Set explicit height for the entire grid container to ensure proper height
            "h-[400px] lg:h-[450px]",
            // Ensure proper aspect ratio container
            "w-full"
          )}
        >
          {currentItems.map((item, index) => {
            // Only use background image if it's successfully loaded
            const shouldShowBackgroundImage =
              item.imageUrl && loadedImages.has(item.imageUrl);

            const backgroundStyle = shouldShowBackgroundImage
              ? {
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {};

            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={`${currentSlideIndex}-${item.id}-${index}`}
                className={cn(
                  "relative transition-all duration-300 ease-out cursor-pointer group overflow-hidden",
                  "hover:scale-[1.03] hover:shadow-lg",
                  "will-change-transform", // Optimize for animations
                  "bg-gray-200", // Fallback background
                  "col-span-1 row-span-1", // All items same size in 2x5 grid
                  "rounded-md", // Slightly smaller border radius for compact items
                  // Remove aspect ratio constraint and let items fill the grid cell naturally
                  "w-full h-full", // Fill grid cell completely
                  "min-h-0" // Allow shrinking
                )}
                style={backgroundStyle}
                onClick={() => handleItemClick(item, index)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Loading indicator for background image */}
                {item.imageUrl && !shouldShowBackgroundImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <div className="w-6 h-6 border-2 border-gray-500 border-t-gray-700 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Title overlay - only show on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10 transition-all duration-300">
                    <h2 className="text-white font-semibold text-center px-1 text-[9px] lg:text-[10px] leading-tight line-clamp-3">
                      {item.title}
                    </h2>
                  </div>
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-5"></div>
              </div>
            );
          })}
        </div>

        {/* Slide indicators - only show if we have more than one slide worth of items */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-3 gap-1.5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentSlideIndex
                    ? "bg-brand-primary w-4 h-1.5"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
