import React, { useEffect } from "react";
import { Highlight } from "./highlight-model";
import HighlightList from "./highlight-list";
import HighlightFilters from "./highlight-filters";
import { HighlightsProvider } from "./highlights-context";
import { useHighlights } from "./use-highlights";
import { highlightsThunks } from "./highlights-actions";

// Component to handle Chrome storage synchronization
const StorageSynchronizer: React.FC = () => {
  const { dispatch } = useHighlights();

  // Set up Chrome storage change listener
  useEffect(() => {
    const handleStorageChanges = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.highlights && changes.highlights.newValue) {
        dispatch(highlightsThunks.loadHighlightsFromStorage());
      }
    };

    // Listen for Chrome storage changes
    chrome.storage?.onChanged?.addListener(handleStorageChanges);

    return () => {
      chrome.storage?.onChanged?.removeListener(handleStorageChanges);
    };
  }, [dispatch]);

  return null; // This component doesn't render anything
};

interface HighlightsContainerProps {
  initialHighlights: Highlight[];
}

const HighlightsContainer: React.FC<HighlightsContainerProps> = ({
  initialHighlights,
}) => {
  return (
    <HighlightsProvider initialHighlights={initialHighlights}>
      <StorageSynchronizer />
      <div className="flex flex-col h-full">
        <HighlightFilters />
        <HighlightList />
      </div>
    </HighlightsProvider>
  );
};

export default HighlightsContainer;
