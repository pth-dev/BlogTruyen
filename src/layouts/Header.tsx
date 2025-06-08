import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Search } from "../components/common/Search";
import { useAuthStore } from "../stores/authStore";
import { Logo } from "../components/common/Logo";
import { type Category } from "../components/common/Categories";
import { MobileCategoriesMenu } from "../components/common/MobileCategoriesMenu";
import { Menu, Search as SearchIcon, X, Grid3X3 } from "lucide-react";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all-category");

  // Categories data
  const categories: Category[] = [
    { id: "all-category", name: "All category" },
    { id: "shonen", name: "Shonen" },
    { id: "shojo", name: "Shojo" },
    { id: "seinen", name: "Seinen" },
    { id: "josei", name: "Josei" },
    { id: "kodomomuke", name: "Kodomomuke" },
    { id: "one-shot", name: "One Shot" },
    { id: "action", name: "Action" },
    { id: "adventure", name: "Adventure" },
    { id: "fantasy", name: "Fantasy" },
    { id: "dark-fantasy", name: "Dark Fantasy" },
    { id: "ecchi", name: "Ecchi" },
    { id: "romance", name: "Romance" },
    { id: "horror", name: "Horror" },
    { id: "parody", name: "Parody" },
    { id: "mystery", name: "Mystery" },
  ];

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowMobileCategories(false);
    console.log("Selected category:", categoryId);

    // Navigate to category page if not "all-category"
    if (categoryId !== "all-category") {
      navigate(`/category/${categoryId}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  // Helper functions to handle mutual exclusive mobile states
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileMenu(false);
    setShowMobileCategories(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowMobileSearch(false);
    setShowMobileCategories(false);
  };

  const toggleMobileCategories = () => {
    setShowMobileCategories(!showMobileCategories);
    setShowMobileSearch(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center gap-6">
          {/* Logo - Left (30% width) */}
          <div className="w-[50%] flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="md" variant="default" />
            </Link>
          </div>

          {/* Desktop Search and Auth - Right (70% width) */}
          <div className="hidden lg:flex items-center gap-6 w-[50%]">
            {/* Search Component */}
            <div className="flex-1 max-w-md">
              <Search
                placeholder="Search here"
                onSearch={handleSearch}
                className=""
              />
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-6 py-2 rounded-full border-primary text-primary hover:bg-primary/10"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button
                      size="sm"
                      className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions - Right side */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSearch}
              className={`h-10 w-10 transition-colors duration-200 ${
                showMobileSearch ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Mobile Categories Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileCategories}
              className={`h-10 w-10 transition-colors duration-200 ${
                showMobileCategories ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className={`h-10 w-10 transition-colors duration-200 ${
                showMobileMenu ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {showMobileMenu ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileSearch
              ? "max-h-24 py-4 opacity-100"
              : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="px-4">
            <Search
              placeholder="Search here"
              onSearch={handleSearch}
              className=""
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileMenu
              ? "max-h-[500px] py-4 opacity-100"
              : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="px-4">
            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Discover Comics
                </Link>
                <Link
                  to="/authors"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Authors
                </Link>
                <Link
                  to="/notifications"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Notifications
                </Link>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/donate"
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Donate
                  </Link>
                </div>
              </div>

              {/* Auth Actions */}
              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👤 Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 ">
                    <Link
                      to="/auth/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex-1"
                    >
                      <Button className="w-full justify-center text-white bg-[#1B6FA8] rounded-none hover:bg-[#1B6FA8]/10">
                        Log in
                      </Button>
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-center bg-none text-black border-black hover:text-foreground hover:bg-primary/90"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Categories */}
        <div
          className={`lg:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileCategories
              ? "max-h-[400px] py-4 opacity-100"
              : "max-h-0 py-0 opacity-0"
          }`}
        >
          <div className="px-4">
            <MobileCategoriesMenu
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
