import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui";
import { MangaGrid } from "../components/common/MangaGrid";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useTruyenDetailQuery, useHomeQuery } from "../hooks/useApiQueries";
import { useMangaStore } from "../stores/mangaStore";
import { transformHomeDataToMangaList } from "../utils/dataTransform";
import { Heart, AlertCircle } from "lucide-react";

export const MangaDetailPage: React.FC = () => {
  const { slug: encodedSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Decode slug để xử lý ký tự đặc biệt
  const slug = encodedSlug ? decodeURIComponent(encodedSlug) : "";

  // Bookmark functionality
  const { addBookmark, removeBookmark, isBookmarked } = useMangaStore();

  // Simple TanStack Query
  const {
    data: mangaData,
    isLoading: mangaLoading,
    error: mangaError,
  } = useTruyenDetailQuery(slug);
  const { data: homeData, isLoading: homeLoading } = useHomeQuery();

  // Get recommendations from home data
  const recommendedMangas = homeData
    ? transformHomeDataToMangaList(homeData.data).allMangas.slice(0, 10)
    : [];

  const handleMangaClick = (manga: any) => {
    const mangaIdentifier = encodeURIComponent(manga.slug || manga.id);
    navigate(`/manga/${mangaIdentifier}`);
  };

  // Loading state
  if (mangaLoading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-4">Loading manga details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (mangaError) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Manga Not Found</h1>
          <p className="text-gray-300 mb-6">
            The manga you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-[#1B6FA8] hover:bg-[#1B6FA8]/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const manga = mangaData?.data?.item;
  const cdnDomain =
    mangaData?.data?.APP_DOMAIN_CDN_IMAGE || "https://img.otruyenapi.com";

  // Get actual chapters from server_data
  const actualChapters = manga?.chapters?.[0]?.server_data || [];
  const totalChapters = actualChapters.length;

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Show relative time for recent dates
      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

      // Show formatted date for older dates
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  if (!manga) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">No Manga Found</h1>
          <p className="text-gray-300 mb-6">
            This manga doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-[#1B6FA8] hover:bg-[#1B6FA8]/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Build full image URL
  const coverImage = manga?.thumb_url?.startsWith("http")
    ? manga.thumb_url
    : `${cdnDomain}/uploads/comics/${manga?.thumb_url}`;

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="bg-[#1F1F1F] pt-4 md:pt-6">
        <div className="container px-0 md:px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
              <TabsTrigger
                value="overview"
                className="text-white data-[state=active]:bg-[#1B6FA8] data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="chapters"
                className="text-white data-[state=active]:bg-[#1B6FA8] data-[state=active]:text-white"
              >
                Chapters ({totalChapters})
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="text-white data-[state=active]:bg-[#1B6FA8] data-[state=active]:text-white"
              >
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                {/* Cover Image */}
                <div className="lg:col-span-1">
                  <div className="aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0">
                    <img
                      src={coverImage}
                      alt={manga.name}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-manga.jpg";
                      }}
                    />
                  </div>
                </div>

                {/* Manga Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {manga.name}
                    </h1>
                    <p className="text-gray-300 text-lg">{manga.origin_name}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => {
                        if (actualChapters.length > 0) {
                          // Get the latest chapter (first in the original array, last after reverse)
                          const latestChapter =
                            actualChapters[actualChapters.length - 1];
                          const encodedApiUrl = encodeURIComponent(
                            latestChapter.chapter_api_data
                          );
                          navigate(`/reader/${encodedApiUrl}?manga=${slug}`, {
                            state: { mangaSlug: slug },
                          });
                        }
                      }}
                      className="bg-[#1B6FA8] hover:bg-[#1B6FA8]/90 text-white px-8 py-3 text-lg"
                    >
                      Read Now
                    </Button>
                    <Button
                      onClick={() => {
                        const mangaId = manga._id || manga.slug || slug;
                        if (isBookmarked(mangaId)) {
                          removeBookmark(mangaId);
                        } else {
                          addBookmark(mangaId);
                        }
                      }}
                      className={`px-6 py-3 border-2 transition-all duration-200 ${
                        isBookmarked(manga._id || manga.slug || slug)
                          ? "bg-[#F4B333] border-[#F4B333] text-white hover:bg-[#F4B333]/90"
                          : "bg-transparent border-[#F4B333] text-[#F4B333] hover:bg-[#F4B333] hover:text-white"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${
                          isBookmarked(manga._id || manga.slug || slug)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {isBookmarked(manga._id || manga.slug || slug)
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 font-medium">{manga.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <span className="ml-2 font-medium">
                        {manga.author?.join(", ") || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Updated:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(manga.updatedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Chapters:</span>
                      <span className="ml-2 font-medium">{totalChapters}</span>
                    </div>
                  </div>

                  {manga.category && manga.category.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Genres:</h3>
                      <div className="flex flex-wrap gap-2">
                        {manga.category.map((genre: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {manga.content && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Description:
                      </h3>
                      <div
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: manga.content }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="mt-6">
              <div className="p-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Chapters ({totalChapters})
                </h2>
                {actualChapters.length > 0 ? (
                  <div className="space-y-2">
                    {actualChapters
                      .slice()
                      .reverse()
                      .map((chapter: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            const encodedApiUrl = encodeURIComponent(
                              chapter.chapter_api_data
                            );
                            navigate(`/reader/${encodedApiUrl}?manga=${slug}`, {
                              state: { mangaSlug: slug },
                            });
                          }}
                          className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                          <div>
                            <h3 className="text-white font-medium">
                              Chapter {chapter.chapter_name}
                            </h3>
                            {chapter.chapter_title && (
                              <p className="text-gray-400 text-sm">
                                {chapter.chapter_title}
                              </p>
                            )}
                          </div>
                          {chapter.chapter_updated && (
                            <div className="text-gray-400 text-sm">
                              {formatDate(chapter.chapter_updated)}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No chapters available</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <div className="p-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  You might also like
                </h2>
                {homeLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : recommendedMangas.length > 0 ? (
                  <MangaGrid
                    mangas={recommendedMangas}
                    onMangaClick={handleMangaClick}
                    loading={false}
                    columns={{ mobile: 2, tablet: 3, desktop: 5 }}
                    cardSize="md"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No recommendations available
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
