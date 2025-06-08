import type { OTruyenMangaItem, OTruyenHomeData } from "../types";
import type { MangaData } from "../components/common/MangaCard";

/**
 * Transform OTruyenAPI manga item to MangaCard format
 */
export const transformOTruyenMangaToMangaData = (
  item: OTruyenMangaItem,
  cdnDomain: string
): MangaData => {
  // Get latest chapter info
  const latestChapter = item.chaptersLatest?.[0];
  const chapterText = latestChapter
    ? `Chapter ${latestChapter.chapter_name}`
    : "No chapters";

  // Get genres from categories
  const genres = item.category?.map((cat) => cat.name) || [];

  // Generate a rating (since API doesn't provide rating, we'll use a placeholder)
  const rating = Math.round((Math.random() * 2 + 8) * 100) / 100; // Random rating between 8-10

  // Build full image URL - fix the path construction
  const coverImage = item.thumb_url.startsWith("http")
    ? item.thumb_url
    : `${cdnDomain}/uploads/comics/${item.thumb_url}`;

  return {
    id: item._id,
    slug: item.slug, // Add slug for navigation
    title: item.name,
    chapter: chapterText,
    rating,
    coverImage,
    genres,
    status:
      item.status === "ongoing"
        ? "Ongoing"
        : item.status === "completed"
        ? "Completed"
        : "Hiatus",
  };
};

/**
 * Transform OTruyenAPI home data to manga list
 */
export const transformHomeDataToMangaList = (homeData: OTruyenHomeData) => {
  const cdnDomain = homeData.APP_DOMAIN_CDN_IMAGE;
  const allMangas = homeData.items.map((item) =>
    transformOTruyenMangaToMangaData(item, cdnDomain)
  );

  return {
    allMangas,
    cdnDomain,
  };
};

/**
 * Transform manga data to hero banner items for AutoSlideHeroBanner
 */
export const transformMangaToHeroBannerItems = (
  mangas: MangaData[],
  onMangaClick?: (manga: MangaData) => void
) => {
  return mangas.map((manga) => {
    // Use coverImage from MangaData
    const imageUrl = manga.coverImage || "";

    return {
      id: manga.id,
      title: manga.title,
      slug: manga.slug || manga.id,
      imageUrl: imageUrl,
      onClick: () => {
        if (onMangaClick) {
          onMangaClick(manga);
        }
      },
    };
  });
};

/**
 * Transform hero slides from og_image array and manga data (legacy)
 */
export const transformOgImageToHeroSlides = (
  ogImages: string[],
  mangas: MangaData[],
  cdnDomain: string,
  count: number = 8,
  onMangaClick?: (manga: MangaData) => void
) => {
  const gradients = [
    { from: "from-orange-500", to: "to-red-600" },
    { from: "from-purple-600", to: "to-blue-600" },
    { from: "from-green-600", to: "to-teal-600" },
    { from: "from-pink-500", to: "to-purple-600" },
    { from: "from-blue-500", to: "to-cyan-600" },
    { from: "from-red-500", to: "to-orange-600" },
    { from: "from-indigo-500", to: "to-purple-600" },
    { from: "from-teal-500", to: "to-green-600" },
  ];

  const badges = [
    { text: "Manga", icon: "📖", variant: "manga" as const },
    { text: "Manhwa", icon: "📚", variant: "manhwa" as const },
    { text: "Manhua", icon: "📑", variant: "manhua" as const },
  ];

  return ogImages.slice(0, count).map((imagePath, index) => {
    const manga = mangas[index] || mangas[index % mangas.length] || mangas[0]; // Better fallback

    // Improved URL construction with better validation
    let imageUrl = "";
    if (imagePath.startsWith("http")) {
      imageUrl = imagePath;
    } else {
      // Ensure proper URL construction
      const cleanCdnDomain = cdnDomain.endsWith("/")
        ? cdnDomain.slice(0, -1)
        : cdnDomain;
      const cleanImagePath = imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;
      imageUrl = `${cleanCdnDomain}${cleanImagePath}`;
    }

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`Hero slide ${index}: ${imagePath} -> ${imageUrl}`);
    }

    return {
      id: manga?.id || `slide-${index}`,
      title: manga?.title || "Featured Manga",
      slug: manga?.slug || manga?.id,
      description: manga
        ? `Discover the amazing world of ${manga.title}. Join the adventure with incredible storytelling and stunning artwork.`
        : "Discover amazing manga with incredible storytelling and stunning artwork.",
      gradientFrom: gradients[index % gradients.length].from,
      gradientTo: gradients[index % gradients.length].to,
      backgroundImage: imageUrl, // Add background image from og_image
      categoryBadge: badges[index % badges.length],
      chapterInfo: {
        text: manga?.chapter || "Latest Chapter",
        onClick: () =>
          console.log(`Navigate to ${manga?.title || "manga"} chapter`),
      },
      actionButton: {
        text: "READ",
        variant: "primary" as const,
        onClick: () => console.log(`Start reading ${manga?.title || "manga"}`),
      },
      onClick: () => {
        if (manga && onMangaClick) {
          onMangaClick(manga);
        }
      },
    };
  });
};

/**
 * Transform hero slides from manga data (fallback method)
 */
export const transformMangaToHeroSlides = (
  mangas: MangaData[],
  count: number = 3
) => {
  const gradients = [
    { from: "from-orange-500", to: "to-red-600" },
    { from: "from-purple-600", to: "to-blue-600" },
    { from: "from-green-600", to: "to-teal-600" },
    { from: "from-pink-500", to: "to-purple-600" },
    { from: "from-blue-500", to: "to-cyan-600" },
  ];

  const badges = [
    { text: "Manga", icon: "📖", variant: "manga" as const },
    { text: "Manhwa", icon: "📚", variant: "manhwa" as const },
    { text: "Manhua", icon: "📑", variant: "manhua" as const },
  ];

  return mangas.slice(0, count).map((manga, index) => ({
    id: manga.id,
    title: manga.title,
    description: `Discover the amazing world of ${manga.title}. Join the adventure with incredible storytelling and stunning artwork.`,
    gradientFrom: gradients[index % gradients.length].from,
    gradientTo: gradients[index % gradients.length].to,
    categoryBadge: badges[index % badges.length],
    chapterInfo: {
      text: manga.chapter,
      onClick: () => console.log(`Navigate to ${manga.title} chapter`),
    },
    actionButton: {
      text: "READ",
      variant: "primary" as const,
      onClick: () => console.log(`Start reading ${manga.title}`),
    },
  }));
};

/**
 * Get image URL with CDN domain
 */
export const getImageUrl = (imagePath: string, cdnDomain: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${cdnDomain}${imagePath}`;
};

/**
 * Format chapter name for display
 */
export const formatChapterName = (chapterName: string): string => {
  if (chapterName.toLowerCase().includes("chapter")) {
    return chapterName;
  }
  return `Chapter ${chapterName}`;
};

/**
 * Get status display text
 */
export const getStatusDisplay = (status: string): string => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    case "hiatus":
      return "Hiatus";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};
