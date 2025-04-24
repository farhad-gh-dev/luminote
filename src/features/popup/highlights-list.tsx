import { useState, useMemo } from "react";
import HighlightItem from "./highlight-item";
import SearchHighlights from "./search-highlights";
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
    <div className="space-y-3">
      <SearchHighlights onSearch={setSearchQuery} />

      {filteredHighlights.length > 0 ? (
        filteredHighlights.map((highlight) => (
          <HighlightItem
            key={highlight.id}
            highlight={highlight}
            onDelete={onDeleteHighlight}
            isDeleting={isDeleting === highlight.id}
          />
        ))
      ) : (
        <div className="mt-6">
          <div className="text-center text-gray-500">
            No highlights found matching "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsList;
