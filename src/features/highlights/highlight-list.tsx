import React, { useMemo } from "react";
import HighlightItem from "./highlight-item";
import EmptyState from "../../components/empty-state";
import { useHighlights } from "./use-highlights";

const HighlightList: React.FC = () => {
  const { state } = useHighlights();
  const { highlights, filter, colorFilter } = state;

  // Filter highlights based on current filters
  const filteredHighlights = useMemo(() => {
    return highlights.filter((highlight) => {
      const matchesText =
        !filter ||
        highlight.text.toLowerCase().includes(filter.toLowerCase()) ||
        highlight.title.toLowerCase().includes(filter.toLowerCase());

      const matchesColor = !colorFilter || highlight.color === colorFilter;

      return matchesText && matchesColor;
    });
  }, [highlights, filter, colorFilter]);

  return (
    <div className="flex-grow overflow-y-auto">
      {filteredHighlights.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filteredHighlights.map((highlight) => (
            <HighlightItem key={highlight.id} highlight={highlight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HighlightList;
