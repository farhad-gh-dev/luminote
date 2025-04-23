import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import HighlightsList from "@/features/highlights/highlights-list";
import { getHighlights } from "@/services/chrome-api";
import type { Highlight } from "@/types";

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-96 h-[600px] bg-gray-50 p-4 flex flex-col">
      <Header />
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-500">Loading highlights...</div>
        </div>
      ) : (
        <HighlightsList initialHighlights={highlights} />
      )}
      {JSON.stringify(highlights)}
    </div>
  );
}

export default App;
