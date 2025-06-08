import React, { useState } from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = "Search here",
  onSearch,
  className = "",
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleFilterClick = () => {
    // TODO: Implement filter functionality
    console.log("Filter clicked");
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative group">
        <div className="relative flex items-center bg-background border border-border rounded-full shadow-sm transition-all duration-200 hover:shadow-lg">
          {/* Search Icon */}
          <div className="flex items-center justify-center w-10 h-10 text-muted-foreground">
            <SearchIcon className="w-4 h-4" />
          </div>

          {/* Search Input */}
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            className="flex-1 border-0 bg-transparent text-foreground placeholder-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-0"
          />

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-2" />

          {/* Filter Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFilterClick}
            className="mr-2 p-1.5 hover:bg-accent rounded-full"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Shadow with primary color - only visible on hover */}
        <div className="absolute inset-0 rounded-full -z-10 transform translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-full h-full rounded-full bg-[#F4B333]/60" />
        </div>
      </div>
    </div>
  );
};
