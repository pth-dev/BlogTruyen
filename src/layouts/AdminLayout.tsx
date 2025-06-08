import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Header } from "./Header";

interface AdminLayoutProps {
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ className = "" }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated and has admin role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-muted border-r">
          <nav className="p-4">
            <h2 className="font-semibold text-lg mb-4">Admin Panel</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin/dashboard"
                  className="block p-2 rounded hover:bg-accent"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/manga"
                  className="block p-2 rounded hover:bg-accent"
                >
                  Quản lý truyện
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className="block p-2 rounded hover:bg-accent"
                >
                  Quản lý người dùng
                </a>
              </li>
              <li>
                <a
                  href="/admin/comments"
                  className="block p-2 rounded hover:bg-accent"
                >
                  Quản lý bình luận
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
