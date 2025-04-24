import { useMemo } from "react";
import HighlightItemUI from "@/components/layout/highlight-item-ui";
import type { Highlight } from "@/types";

interface HighlightItemProps {
  highlight: Highlight;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const HighlightItem: React.FC<HighlightItemProps> = ({
  highlight,
  onDelete,
  isDeleting,
}) => {
  // Format the date for display
  const formattedDate = useMemo(() => {
    const date = new Date(highlight.createdAt);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }, [highlight.createdAt]);

  // Extract hostname from URL for display
  const hostname = useMemo(() => {
    try {
      return new URL(highlight.url).hostname.replace("www.", "");
    } catch {
      return highlight.url;
    }
  }, [highlight.url]);

  const handleDelete = () => {
    if (!isDeleting) {
      onDelete(highlight.id);
    }
  };

  return (
    <HighlightItemUI
      id={highlight.id}
      text={highlight.text}
      url={highlight.url}
      title={highlight.title}
      color={highlight.color}
      formattedDate={formattedDate}
      hostname={hostname}
      websiteTitle={highlight.websiteTitle}
      websiteIconUrl={highlight.websiteIconUrl}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
};

export default HighlightItem;
