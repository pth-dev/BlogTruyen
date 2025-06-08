import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ReaderLayout } from "../layouts/ReaderLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

// Import pages directly for now (can be lazy loaded later)
import {
  BrowsePage,
  MangaDetailPage,
  ReaderPage,
  RegisterPage,
  BookmarksPage,
  HistoryPage,
  ProfilePage,
} from "../pages";
import { NotFoundPage } from "../pages/NotFoundPage";
import { CategoryListPage } from "../pages/CategoryListPage";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "browse",
        element: <BrowsePage />,
      },
      {
        path: "browse/:category",
        element: <BrowsePage />,
      },
      {
        path: "manga/:slug",
        element: <MangaDetailPage />,
      },
      {
        path: "category/:slug",
        element: <CategoryListPage />,
      },

      // Protected routes (require authentication)
      {
        path: "user",
        element: <AuthLayout requireAuth={true} />,
        children: [
          {
            path: "bookmarks",
            element: <BookmarksPage />,
          },
          {
            path: "history",
            element: <HistoryPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  // Auth routes (separate layout)
  {
    path: "/auth",
    element: <AuthLayout requireAuth={false} />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },

  // Reader layout (fullscreen, no header/footer)
  {
    path: "/reader",
    element: <ReaderLayout />,
    children: [
      {
        path: ":chapterApiUrl",
        element: <ReaderPage />,
      },
    ],
  },

  // Admin layout (protected, with sidebar)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <div>Admin Dashboard</div>,
      },
      {
        path: "manga",
        element: <div>Manga Management</div>,
      },
      {
        path: "users",
        element: <div>User Management</div>,
      },
      {
        path: "comments",
        element: <div>Comment Management</div>,
      },
    ],
  },

  // 404 page
  {
    path: "*",
    element: <MainLayout />,
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
