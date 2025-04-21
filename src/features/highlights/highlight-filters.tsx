import React, { useState, useEffect } from "react";
import { useHighlights } from "./use-highlights";
import { highlightsActions } from "./highlights-actions";
import Button from "../../components/button";

const HighlightFilters: React.FC = () => {
  const { state, dispatch } = useHighlights();
  const { filter, colorFilter } = state;

  // Local state for the input field
  const [searchInput, setSearchInput] = useState(filter || "");

  // Update filter when input changes after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(highlightsActions.setFilter(searchInput || null));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  // Handle color filter changes
  const handleColorFilter = (color: string | null) => {
    dispatch(
      highlightsActions.setColorFilter(color === colorFilter ? null : color)
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    dispatch(highlightsActions.setFilter(null));
    dispatch(highlightsActions.setColorFilter(null));
  };

  return (
    <div className="mb-4 space-y-3">
      <div>
        <input
          type="text"
          placeholder="Search highlights..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="text-sm text-gray-500">Filter by color:</div>

        {/* Color filter buttons */}
        <div className="flex gap-2">
          <button
            className={`w-5 h-5 rounded-full bg-amber-300 border ${
              colorFilter === "yellow"
                ? "border-gray-800 ring-2 ring-amber-200"
                : "border-gray-300"
            }`}
            onClick={() => handleColorFilter("yellow")}
            title="Yellow"
          />
          <button
            className={`w-5 h-5 rounded-full bg-emerald-300 border ${
              colorFilter === "green"
                ? "border-gray-800 ring-2 ring-emerald-200"
                : "border-gray-300"
            }`}
            onClick={() => handleColorFilter("green")}
            title="Green"
          />
          <button
            className={`w-5 h-5 rounded-full bg-sky-300 border ${
              colorFilter === "blue"
                ? "border-gray-800 ring-2 ring-sky-200"
                : "border-gray-300"
            }`}
            onClick={() => handleColorFilter("blue")}
            title="Blue"
          />
          <button
            className={`w-5 h-5 rounded-full bg-violet-300 border ${
              colorFilter === "purple"
                ? "border-gray-800 ring-2 ring-violet-200"
                : "border-gray-300"
            }`}
            onClick={() => handleColorFilter("purple")}
            title="Purple"
          />
        </div>

        {/* Clear filters button - only shown if filters are applied */}
        {(filter || colorFilter) && (
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default HighlightFilters;
