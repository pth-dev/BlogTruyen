import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Users,
  Bell,
  Settings,
  Heart,
  LogIn,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const location = useLocation();

  const menuItems: NavItem[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      href: "/",
      isActive: location.pathname === "/",
    },
    {
      icon: <Compass className="w-5 h-5" />,
      label: "Discover Comics",
      href: "/browse?category=action",
      isActive:
        location.pathname === "/browse" ||
        location.pathname.startsWith("/category/") ||
        location.pathname.startsWith("/manga/"),
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Authors",
      href: "/authors",
      isActive: location.pathname === "/authors",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
      isActive: location.pathname === "/notifications",
    },
  ];

  const generalItems: NavItem[] = [
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
      isActive: location.pathname === "/settings",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Donate",
      href: "/donate",
      isActive: location.pathname === "/donate",
    },
    {
      icon: <LogIn className="w-5 h-5" />,
      label: "Sign in",
      href: "/auth/login",
      isActive: location.pathname === "/auth/login",
    },
  ];

  return (
    <aside
      className={`w-64 bg-[#1B6FA8] text-white flex flex-col h-full ${className}`}
    >
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Menu Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/80">Menu</h3>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive
                    ? "bg-[#F4B333] text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* General Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/80">General</h3>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive
                    ? "bg-[#F4B333] text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Toggle */}
      {/* <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 bg-gray-600 rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
          </div>
        </div>
      </div> */}
    </aside>
  );
};
