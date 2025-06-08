import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginCredentials } from "../types";

interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual API call
          console.log("Login with:", credentials);

          // Mock user data
          const mockUser: User = {
            id: "1",
            username: "testuser",
            email: credentials.email,
            role: "reader",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual API call
          console.log("Register with:", credentials);

          // Mock user data
          const mockUser: User = {
            id: "1",
            username: credentials.username,
            email: credentials.email,
            role: "reader",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Registration failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          // TODO: Implement actual API call
          const updatedUser = { ...user, ...data };
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          console.error("Profile update failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
