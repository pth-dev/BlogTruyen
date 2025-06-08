import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      actualTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const actualTheme = theme === "system" ? getSystemTheme() : theme;
        applyTheme(actualTheme);
        set({ theme, actualTheme });
      },

      toggleTheme: () => {
        const { actualTheme } = get();
        const newTheme = actualTheme === "light" ? "dark" : "light";
        applyTheme(newTheme);
        set({ theme: newTheme, actualTheme: newTheme });
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const actualTheme =
            state.theme === "system" ? getSystemTheme() : state.theme;
          applyTheme(actualTheme);
          state.actualTheme = actualTheme;
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const { theme } = useTheme.getState();
      if (theme === "system") {
        const newActualTheme = e.matches ? "dark" : "light";
        applyTheme(newActualTheme);
        useTheme.setState({ actualTheme: newActualTheme });
      }
    });
}
