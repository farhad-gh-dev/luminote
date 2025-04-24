import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import HighlightsList from "@/features/popup/highlights-list";
import EmptyState from "@/components/layout/empty-state";
import Loading from "@/components/common/loading";
import { getHighlights, deleteHighlight } from "@/services/chrome-api";
import type { Highlight } from "@/types";

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const fetchedHighlights = await getHighlights();
        setHighlights(fetchedHighlights);
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
    <div className="w-96 h-[600px] bg-white p-4 flex flex-col">
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
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
