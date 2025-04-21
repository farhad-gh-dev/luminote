import React from "react";
import HighlightItemUI from "../../components/highlight-item-ui";
import { Highlight } from "./highlight-model";
import { useHighlights } from "./use-highlights";
import { highlightsThunks } from "./highlights-actions";

interface HighlightItemProps {
  highlight: Highlight;
}

// Format date to be more readable
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Extract hostname from URL
const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    // Ignore the error and return the original URL
    return url;
  }
};

const HighlightItem: React.FC<HighlightItemProps> = ({ highlight }) => {
  const { dispatch } = useHighlights();

  // Process the data for UI presentation
  const formattedDate = formatDate(highlight.createdAt);
  const hostname = getHostname(highlight.url);

  // Use the thunk action creator for deletion
  const handleDelete = (id: string) => {
    dispatch(highlightsThunks.deleteHighlightAndSync(id));
  };

  return (
    <HighlightItemUI
      id={highlight.id}
      text={highlight.text}
      url={highlight.url}
      title={highlight.title}
      formattedDate={formattedDate}
      color={highlight.color}
      hostname={hostname}
      onDelete={handleDelete}
    />
  );
};

export default HighlightItem;
