import React from "react";
import { cn } from "../../utils/cn";
import type { Category } from "./Categories";

interface MobileCategoriesMenuProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  className?: string;
}

export const MobileCategoriesMenu: React.FC<MobileCategoriesMenuProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = "",
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">
          Hot <span className="text-red-500">Categories</span>
        </h3>
      </div>

      {/* Categories Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded transition-all duration-200 text-center transform hover:scale-105 active:scale-95 animate-fade-in-up",
                isSelected
                  ? "bg-[#1B6FA8] text-white shadow-md"
                  : "bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
