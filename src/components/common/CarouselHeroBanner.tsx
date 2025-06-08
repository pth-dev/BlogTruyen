import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

interface HeroSlide {
  id: string;
  title: string;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
  chapterInfo?: {
    text: string;
    onClick?: () => void;
  };
  onClick?: () => void;
}

interface CarouselHeroBannerProps {
  slides: HeroSlide[];
  height?: "sm" | "md" | "lg" | "xl";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  className?: string;
  onSlideChange?: (slideIndex: number) => void;
}

const heightClasses = {
  sm: "h-[20vh] min-h-[200px]",
  md: "h-[30vh] min-h-[250px]",
  lg: "h-[40vh] min-h-[300px]",
  xl: "h-[50vh] min-h-[400px]",
};

export const CarouselHeroBanner: React.FC<CarouselHeroBannerProps> = ({
  slides,
  height = "sm",
  autoPlay = true,
  autoPlayInterval = 8000,
  showNavigation = true,
  className,
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  // Notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(currentSlide);
  }, [currentSlide, onSlideChange]);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides
        .filter(
          (slide) =>
            slide.backgroundImage && !loadedImages.has(slide.backgroundImage)
        )
        .map((slide) => {
          return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(slide.backgroundImage!);
            img.onerror = () => reject(slide.backgroundImage!);
            img.src = slide.backgroundImage!;
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

    if (slides.length > 0) {
      preloadImages();
    }
  }, [slides, loadedImages]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && slides.length > 1) {
      goToNext();
    }
    if (isRightSwipe && slides.length > 1) {
      goToPrevious();
    }
  };

  if (!slides.length) return null;

  const currentSlideData = slides[currentSlide];

  // Only use background image if it's successfully loaded
  const shouldShowBackgroundImage =
    currentSlideData.backgroundImage &&
    loadedImages.has(currentSlideData.backgroundImage);

  const backgroundStyle = shouldShowBackgroundImage
    ? {
        backgroundImage: `url(${currentSlideData.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll", // Better performance on mobile
      }
    : {};

  return (
    <div className={cn("w-full", className)}>
      {/* Hero Banner with container padding */}
      <div className="p-4 lg:p-6">
        <div
          className={cn(
            "relative text-white transition-all duration-500 ease-out rounded-xl overflow-hidden group cursor-pointer",
            "will-change-transform", // Optimize for animations
            heightClasses[height],
            // Always apply gradient as fallback, even with background image
            `bg-gradient-to-br ${
              currentSlideData.gradientFrom || "from-brand-primary"
            } ${
              currentSlideData.gradientTo ||
              "via-brand-secondary to-brand-accent"
            }`,
            // Add better responsive handling
            "w-full max-w-full",
            // Improve image rendering
            shouldShowBackgroundImage && "bg-fixed lg:bg-scroll"
          )}
          style={backgroundStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={currentSlideData.onClick}
        >
          {/* Enhanced gradient overlay for better text readability and visual depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

          {/* Loading indicator for background image */}
          {currentSlideData.backgroundImage && !shouldShowBackgroundImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-[3s] ease-in-out"></div>
          </div>

          {/* Main content - center with improved layout */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-6 lg:px-8">
              {/* Enhanced title with better typography */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-wide leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-lg">
                  {currentSlideData.title}
                </span>
              </h1>
            </div>
          </div>

          {/* Enhanced chapter indicator - bottom left */}
          {currentSlideData.chapterInfo && (
            <div className="absolute bottom-4 left-4 z-20">
              <Button
                variant="outline"
                className="bg-white/95 backdrop-blur-sm text-gray-800 border-white/30 hover:bg-white hover:shadow-lg tracking-[0.3em] uppercase font-mono text-xs md:text-sm px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={currentSlideData.chapterInfo.onClick}
              >
                {currentSlideData.chapterInfo.text}
              </Button>
            </div>
          )}

          {/* Enhanced Desktop Navigation Arrows */}
          {showNavigation && slides.length > 1 && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl z-20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl z-20"
                onClick={goToNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Enhanced Desktop Dot Pagination */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex gap-3 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "relative transition-all duration-300 transform hover:scale-125 group",
                    index === currentSlide
                      ? "w-8 h-3 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full shadow-lg"
                      : "w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full backdrop-blur-sm border border-white/20"
                  )}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mobile slide indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 right-4 lg:hidden z-20">
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
