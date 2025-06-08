/**
 * Utility functions for category management
 */

export interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
}

/**
 * Calculate optimal number of categories for 2 rows based on responsive design
 * Categories component uses flex layout with responsive wrapping
 */
export const calculateCategoriesFor2Rows = () => {
  // Based on Categories component layout:
  // - Mobile: ~3-4 items per row (small screen)
  // - Tablet: ~5-6 items per row (medium screen)  
  // - Desktop: ~7-8 items per row (large screen)
  
  // For 2 rows on desktop (most restrictive), we want ~14-16 items
  // This ensures good layout on all screen sizes
  return 16;
};

/**
 * Transform OTruyenAPI categories to our Category interface
 */
export const transformApiCategories = (apiData: any): CategoryItem[] => {
  if (!apiData?.data?.items) {
    return [];
  }

  return apiData.data.items.map((item: any) => ({
    id: item.slug || item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
    name: item.name,
    slug: item.slug,
  }));
};

/**
 * Get categories with "All category" prepended and limited for 2 rows
 */
export const getCategoriesForDisplay = (apiData: any): CategoryItem[] => {
  const apiCategories = transformApiCategories(apiData);
  const maxCategories = calculateCategoriesFor2Rows();
  
  // Add "All category" at the beginning
  const allCategories = [
    { id: "all-category", name: "All category" },
    ...apiCategories,
  ];

  // Limit to ensure 2 rows on desktop
  return allCategories.slice(0, maxCategories);
};

/**
 * Fallback categories when API fails
 */
export const getFallbackCategories = (): CategoryItem[] => {
  return [
    { id: "all-category", name: "All category" },
    { id: "action", name: "Action" },
    { id: "adventure", name: "Adventure" },
    { id: "comedy", name: "Comedy" },
    { id: "drama", name: "Drama" },
    { id: "fantasy", name: "Fantasy" },
    { id: "romance", name: "Romance" },
    { id: "horror", name: "Horror" },
    { id: "mystery", name: "Mystery" },
    { id: "sci-fi", name: "Sci-Fi" },
    { id: "slice-of-life", name: "Slice of Life" },
    { id: "supernatural", name: "Supernatural" },
    { id: "shounen", name: "Shounen" },
    { id: "shoujo", name: "Shoujo" },
    { id: "seinen", name: "Seinen" },
    { id: "josei", name: "Josei" },
  ];
};
