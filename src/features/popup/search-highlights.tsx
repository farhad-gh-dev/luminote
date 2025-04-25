import React, { useState } from "react";
import SearchIcon from "@/components/icons/search-icon";
import CloseIcon from "@/components/icons/close-icon";

interface SearchHighlightsProps {
  onSearch: (searchQuery: string) => void;
}

const SearchHighlights: React.FC<SearchHighlightsProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="relative mb-5">
      <div
        className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-all duration-200 ${
          isFocused ? "text-indigo-500" : "text-gray-400"
        }`}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search highlights..."
        className={`pl-10 pr-10 py-2.5 w-full text-sm bg-white border rounded-md focus:outline-none transition-all duration-200 ${
          isFocused
            ? "border-indigo-500 shadow-sm ring-2 ring-indigo-100"
            : "border-gray-200"
        }`}
        value={searchQuery}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchHighlights;
