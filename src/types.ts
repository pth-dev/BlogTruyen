// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Manga and Content Types
export interface Manga {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  author?: string[];
  artist?: string[];
  genres: string[];
  rating?: number;
  views?: number;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title?: string;
  pages: Page[];
  publishedAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
}

// Bookmark and History Types
export interface Bookmark {
  id: string;
  userId: string;
  mangaId: string;
  createdAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  mangaId: string;
  chapterId: string;
  pageNumber: number;
  readAt: string;
}

// Reader Settings Types
export interface ReaderSettings {
  readingMode: "single" | "double" | "continuous";
  readingDirection: "ltr" | "rtl";
  pageFit: "width" | "height" | "original";
  brightness: number;
  backgroundColor: string;
}

// API Response Types (already defined in dataTransform.ts but exported here for consistency)
export interface OTruyenMangaItem {
  _id: string;
  name: string;
  slug: string;
  thumb_url: string;
  status: "ongoing" | "completed" | "hiatus";
  category?: Array<{ name: string; slug: string }>;
  chaptersLatest?: Array<{
    chapter_name: string;
    chapter_title?: string;
    chapter_api_data: string;
  }>;
}

export interface OTruyenHomeData {
  items: OTruyenMangaItem[];
  APP_DOMAIN_CDN_IMAGE: string;
  params?: {
    pagination?: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      pageRanges?: number;
    };
  };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

// Comment Types
export interface Comment {
  id: string;
  userId: string;
  mangaId: string;
  chapterId?: string;
  content: string;
  parentId?: string; // For nested comments
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "username" | "avatar">;
  replies?: Comment[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "new_chapter" | "comment_reply" | "system" | "update";
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>; // Additional data based on notification type
  createdAt: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  genres?: string[];
  status?: string[];
  sortBy?: "title" | "updated" | "created" | "rating" | "views";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SearchResult {
  items: Manga[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

// Pagination Types
export interface PaginationInfo {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges?: number;
}
