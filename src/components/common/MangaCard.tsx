import React, { useState } from "react";
import { Card } from "../ui/card";
import { Star, Clock } from "lucide-react";
import { cn } from "../../utils/cn";

export interface MangaData {
  id: string;
  slug?: string; // Add slug for navigation
  title: string;
  coverImage: string;
  chapter: string;
  rating: number;
  genres: string[];
  status: "Ongoing" | "Completed" | "Hiatus" | "Continuous";
  views?: number;
  updatedAt?: string;
  description?: string;
  volume?: string;
}

interface MangaCardProps {
  manga: MangaData;
  onClick?: (manga: MangaData) => void;
  className?: string;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  onClick,
  className = "",
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onClick?.(manga);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Format views count
  const formatViews = (views?: number) => {
    if (!views) return "N/A";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // Format updated time
  const formatUpdatedTime = (updatedAt?: string) => {
    if (!updatedAt) return "Unknown";
    try {
      const date = new Date(updatedAt);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return `${Math.floor(diffInHours / 168)}w ago`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/20 group bg-white border border-gray-200 rounded-lg",
        "w-full h-[380px] flex flex-col", // Increased height for more content
        className
      )}
      onClick={handleClick}
    >
      {/* Cover Image - Fixed height for consistency */}
      <div className="relative overflow-hidden h-[240px] flex-shrink-0">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-primary rounded-full animate-spin"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={manga.coverImage}
            alt={manga.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-xs">No Image</div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full text-white shadow-sm",
              manga.status === "Ongoing" && "bg-green-500",
              manga.status === "Completed" && "bg-blue-500",
              manga.status === "Hiatus" && "bg-yellow-500",
              manga.status === "Continuous" && "bg-purple-500"
            )}
          >
            {manga.status}
          </span>
        </div>
      </div>

      {/* Content Section - Flexible height */}
      <div className="flex flex-col flex-grow">
        {/* Blue Title Section */}
        <div className="bg-[#1B6FA8] text-white p-3 text-center flex-shrink-0">
          <h3
            className="font-bold text-sm leading-tight line-clamp-1"
            title={manga.title}
          >
            {manga.title}
          </h3>
        </div>

        {/* White Content Section - Flexible */}
        <div className="bg-white p-3 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            {/* Chapter Info */}
            <div className="text-sm font-medium text-gray-900">
              {manga.chapter}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-900">
                {manga.rating}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({formatViews(manga.views)} views)
              </span>
            </div>

            {/* Genres - Show first 2 */}
            {manga.genres && manga.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {manga.genres.slice(0, 2).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {manga.genres.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                    +{manga.genres.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Updated Time */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Clock className="w-3 h-3" />
            <span>{formatUpdatedTime(manga.updatedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
