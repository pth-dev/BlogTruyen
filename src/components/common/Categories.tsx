import React from "react";
import { cn } from "../../utils/cn";
import { NavigationButton } from "./SpacedButton";

export interface Category {
  id: string;
  name: string;
  count?: number;
  color?: string;
}

interface CategoriesProps {
  title?: string;
  titleHighlight?: string;
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  variant?: "default" | "rounded" | "pills";
  size?: "sm" | "md" | "lg";
  layout?: "grid" | "flex";
  maxRows?: number;
  className?: string;
  titleClassName?: string;
  containerClassName?: string;
  buttonClassName?: string;
  selectedButtonClassName?: string;
  showCount?: boolean;
}

const sizeClasses = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

export const Categories: React.FC<CategoriesProps> = ({
  title = "Categories",
  titleHighlight,
  categories,
  selectedCategory,
  onCategorySelect,
  size = "md",
  layout = "flex",
  className = "",
  titleClassName = "",
  containerClassName = "",
  buttonClassName = "",
  selectedButtonClassName = "",
  showCount = false,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
  };

  const renderTitle = () => {
    if (!title && !titleHighlight) return null;

    return (
      <h2 className={cn("text-xl lg:text-2xl font-bold mb-4", titleClassName)}>
        {title && <span>{title}</span>}
        {titleHighlight && (
          <span className="text-red-500 ml-1">{titleHighlight}</span>
        )}
      </h2>
    );
  };

  const getLayoutClasses = () => {
    if (layout === "grid") {
      return `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2`;
    }
    return "flex flex-wrap gap-2 justify-center";
  };

  const getButtonClasses = (isSelected: boolean) => {
    const baseClasses = cn(
      "transition-all duration-200 font-medium rounded",
      sizeClasses[size],
      buttonClassName
    );

    if (isSelected) {
      return cn(
        baseClasses,
        "bg-[#1B6FA8] text-white hover:bg-[#1B6FA8]/90 border-[#1B6FA8]",
        selectedButtonClassName
      );
    }

    return cn(
      baseClasses,
      "bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-gray-400"
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {renderTitle()}

      {/* Categories with yellow background, rounded top corners only */}
      <div className="bg-[#F4B333] p-4 rounded-t-lg">
        <div className={cn(getLayoutClasses(), containerClassName)}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <NavigationButton
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={getButtonClasses(isSelected)}
              >
                {showCount && category.count
                  ? `${category.name} (${category.count})`
                  : category.name}
              </NavigationButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Preset variant for common use case
export const HotCategories: React.FC<
  Omit<CategoriesProps, "title" | "titleHighlight">
> = (props) => (
  <Categories title="Hot" titleHighlight="Categories" size="md" {...props} />
);
