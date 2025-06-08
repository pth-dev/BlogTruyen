import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chapter, ReaderSettings } from '../types';

interface ReaderState {
  currentChapter: Chapter | null;
  currentPage: number;
  totalPages: number;
  readingSettings: ReaderSettings;
  isFullscreen: boolean;
  setCurrentChapter: (chapter: Chapter | null) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  updateSettings: (settings: Partial<ReaderSettings>) => void;
  toggleFullscreen: () => void;
}

const defaultSettings: ReaderSettings = {
  readingMode: 'single',
  readingDirection: 'ltr',
  pageFit: 'width',
  brightness: 100,
  backgroundColor: '#ffffff',
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      currentChapter: null,
      currentPage: 0,
      totalPages: 0,
      readingSettings: defaultSettings,
      isFullscreen: false,

      setCurrentChapter: (chapter: Chapter | null) => {
        set({ 
          currentChapter: chapter,
          currentPage: 0,
          totalPages: chapter?.pages.length || 0,
        });
      },

      goToPage: (page: number) => {
        const { totalPages } = get();
        if (page >= 0 && page < totalPages) {
          set({ currentPage: page });
        }
      },

      nextPage: () => {
        const { currentPage, totalPages } = get();
        if (currentPage < totalPages - 1) {
          set({ currentPage: currentPage + 1 });
        }
      },

      previousPage: () => {
        const { currentPage } = get();
        if (currentPage > 0) {
          set({ currentPage: currentPage - 1 });
        }
      },

      updateSettings: (settings: Partial<ReaderSettings>) => {
        const { readingSettings } = get();
        set({ 
          readingSettings: { ...readingSettings, ...settings } 
        });
      },

      toggleFullscreen: () => {
        set(state => ({ 
          isFullscreen: !state.isFullscreen 
        }));
      },
    }),
    {
      name: 'reader-storage',
      partialize: (state) => ({ 
        readingSettings: state.readingSettings 
      }),
    }
  )
);
