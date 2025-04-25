import { useState, useMemo } from "react";
import HighlightItem from "./highlight-item";
import SearchHighlights from "./search-highlights";
import LightbulbIcon from "@/components/icons/lightbulb-icon";
import type { Highlight } from "@/types";

interface HighlightsListProps {
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
  isDeleting: string | null;
}

const HighlightsList: React.FC<HighlightsListProps> = ({
  highlights,
  onDeleteHighlight,
  isDeleting,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter highlights based on search query
  const filteredHighlights = useMemo(() => {
    if (!searchQuery) return highlights;

    const query = searchQuery.toLowerCase();
    return highlights.filter(
      (highlight) =>
        highlight.text.toLowerCase().includes(query) ||
        highlight.title.toLowerCase().includes(query)
    );
  }, [highlights, searchQuery]);

  return (
    <div className="space-y-4 px-1">
      <SearchHighlights onSearch={setSearchQuery} />

      {filteredHighlights.length > 0 ? (
        <div className="space-y-4 animate-fadeIn">
          {filteredHighlights.map((highlight, index) => (
            <div
              key={highlight.id}
              className="transition-all duration-300 animate-slideIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HighlightItem
                highlight={highlight}
                onDelete={onDeleteHighlight}
                isDeleting={isDeleting === highlight.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 animate-fadeIn">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
            <LightbulbIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <div className="text-gray-500 font-medium">
              {searchQuery
                ? `No highlights found matching "${searchQuery}"`
                : "No highlights saved yet"}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsList;
