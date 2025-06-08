import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "../components/common/Sidebar";

interface MainLayoutProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  showHeader = true,
  showSidebar = true,
  className = "",
}) => {
  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {showHeader && <Header />}
      <div className="flex flex-1 overflow-hidden">
        {/* Hide sidebar on mobile (lg and below), show on desktop */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 bg-background overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
