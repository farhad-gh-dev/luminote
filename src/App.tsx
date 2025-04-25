import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import HighlightsList from "@/features/popup/highlights-list";
import EmptyState from "@/components/layout/empty-state";
import Loading from "@/components/common/loading";
import { getHighlightsByUrl, deleteHighlight } from "@/services/chrome-api";
import type { Highlight } from "@/types";
import browser from "webextension-polyfill";

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the current active tab's URL
    const getCurrentTabUrl = async () => {
      try {
        // Query for the active tab in the current window
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tabs.length > 0 && tabs[0].url) {
          return tabs[0].url;
        }
        return null;
      } catch (error) {
        console.error("Error getting current tab:", error);
        return null;
      }
    };

    const loadHighlights = async () => {
      try {
        setLoading(true);
        const url = await getCurrentTabUrl();
        setCurrentUrl(url);

        if (url) {
          const fetchedHighlights = await getHighlightsByUrl(url);
          setHighlights(fetchedHighlights);
        } else {
          console.warn("No URL found for current tab");
          setHighlights([]);
        }
      } catch (error) {
        console.error("Failed to load highlights:", error);
        setHighlights([]);
      } finally {
        setLoading(false);
      }
    };

    // Load highlights when the component mounts
    loadHighlights();
  }, []);

  // Handle highlight deletion
  const handleDeleteHighlight = async (id: string) => {
    try {
      setIsDeleting(id);
      const success = await deleteHighlight(id);

      if (success) {
        setHighlights(highlights.filter((highlight) => highlight.id !== id));
      } else {
        console.error("Failed to delete highlight");
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="w-[450px] h-[600px] bg-white p-4 flex flex-col">
      <Header />
      {loading ? (
        <Loading message="Loading highlights..." className="flex-grow" />
      ) : (
        <div className="flex-grow overflow-y-auto">
          {highlights.length > 0 ? (
            <HighlightsList
              highlights={highlights}
              onDeleteHighlight={handleDeleteHighlight}
              isDeleting={isDeleting}
            />
          ) : (
            <EmptyState
              message={
                currentUrl
                  ? "No highlights found for this page"
                  : "Could not determine current page"
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
