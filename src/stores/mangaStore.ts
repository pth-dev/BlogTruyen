import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Manga, Bookmark, ReadingHistory } from '../types';

interface MangaState {
  currentManga: Manga | null;
  readingHistory: ReadingHistory[];
  bookmarks: Bookmark[];
  setCurrentManga: (manga: Manga | null) => void;
  addBookmark: (mangaId: string) => void;
  removeBookmark: (mangaId: string) => void;
  isBookmarked: (mangaId: string) => boolean;
  updateReadingProgress: (mangaId: string, chapterId: string, pageNumber: number) => void;
  getReadingProgress: (mangaId: string) => ReadingHistory | undefined;
}

export const useMangaStore = create<MangaState>()(
  persist(
    (set, get) => ({
      currentManga: null,
      readingHistory: [],
      bookmarks: [],

      setCurrentManga: (manga: Manga | null) => {
        set({ currentManga: manga });
      },

      addBookmark: (mangaId: string) => {
        const { bookmarks } = get();
        const exists = bookmarks.find(b => b.mangaId === mangaId);
        
        if (!exists) {
          const newBookmark: Bookmark = {
            id: Date.now().toString(),
            userId: '1', // TODO: Get from auth store
            mangaId,
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            bookmarks: [...bookmarks, newBookmark] 
          });
        }
      },

      removeBookmark: (mangaId: string) => {
        const { bookmarks } = get();
        set({ 
          bookmarks: bookmarks.filter(b => b.mangaId !== mangaId) 
        });
      },

      isBookmarked: (mangaId: string) => {
        const { bookmarks } = get();
        return bookmarks.some(b => b.mangaId === mangaId);
      },

      updateReadingProgress: (mangaId: string, chapterId: string, pageNumber: number) => {
        const { readingHistory } = get();
        const existingIndex = readingHistory.findIndex(
          h => h.mangaId === mangaId
        );

        const newHistory: ReadingHistory = {
          id: Date.now().toString(),
          userId: '1', // TODO: Get from auth store
          mangaId,
          chapterId,
          pageNumber,
          readAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          const updatedHistory = [...readingHistory];
          updatedHistory[existingIndex] = newHistory;
          set({ readingHistory: updatedHistory });
        } else {
          set({ 
            readingHistory: [...readingHistory, newHistory] 
          });
        }
      },

      getReadingProgress: (mangaId: string) => {
        const { readingHistory } = get();
        return readingHistory.find(h => h.mangaId === mangaId);
      },
    }),
    {
      name: 'manga-storage',
    }
  )
);
