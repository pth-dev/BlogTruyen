import React from "react";
import { MangaCard, type MangaData } from "./MangaCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "../../utils/cn";

interface MangaGridProps {
  mangas: MangaData[];
  title?: string;
  titleHighlight?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  cardSize?: "sm" | "md" | "lg";
  onMangaClick?: (manga: MangaData) => void;
  className?: string;
  titleClassName?: string;
  gridClassName?: string;
  loading?: boolean;
  loadingCount?: number;
}

const getGridClasses = (columns: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) => {
  const { mobile = 2, tablet = 4, desktop = 5 } = columns;

  // Use object mapping for better Tailwind CSS purging
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  };

  const mdGridColsMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
  };

  const lgGridColsMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
  };

  const mobileClass = gridColsMap[mobile] || "grid-cols-2";
  const tabletClass = mdGridColsMap[tablet] || "md:grid-cols-4";
  const desktopClass = lgGridColsMap[desktop] || "lg:grid-cols-5";

  return `grid ${mobileClass} ${tabletClass} ${desktopClass}`;
};

// Simple loading card component
const LoadingCard: React.FC<{ size: "sm" | "md" | "lg" }> = ({ size }) => {
  const sizeClasses = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
  };

  return (
    <div
      className={cn("bg-gray-200 rounded-lg animate-pulse", sizeClasses[size])}
    >
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="sm" />
      </div>
    </div>
  );
};

export const MangaGrid: React.FC<MangaGridProps> = ({
  mangas,
  title,
  titleHighlight,
  columns = { mobile: 2, tablet: 4, desktop: 5 },
  cardSize = "md",
  onMangaClick,
  className = "",
  titleClassName = "",
  gridClassName = "",
  loading = false,
  loadingCount = 8,
}) => {
  const renderTitle = () => {
    if (!title && !titleHighlight) return null;

    return (
      <div className="mb-6">
        <h2 className={cn("text-xl lg:text-2xl font-bold", titleClassName)}>
          {title && <span>{title}</span>}
          {titleHighlight && (
            <span className="text-[#E40066] ml-1">{titleHighlight}</span>
          )}
        </h2>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className={cn(
            getGridClasses(columns),
            "gap-4 lg:gap-6",
            gridClassName
          )}
        >
          {Array.from({ length: loadingCount }).map((_, index) => (
            <LoadingCard key={index} size={cardSize} />
          ))}
        </div>
      );
    }

    if (!mangas.length) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No manga found
          </h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <div
        className={cn(getGridClasses(columns), "gap-4 lg:gap-6", gridClassName)}
      >
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} onClick={onMangaClick} />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {renderTitle()}
      {renderContent()}
    </div>
  );
};
