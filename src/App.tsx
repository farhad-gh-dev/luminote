import { useState, useEffect } from "react";
import Header from "./components/header";
import HighlightsContainer from "./features/highlights/highlights-container";
import { Highlight } from "./features/highlights/highlight-model";
import { mockHighlights } from "./mock-data";

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to load highlights from Chrome storage
    const loadHighlights = async () => {
      try {
        // In development mode, use mock data if Chrome API is not available
        if (!chrome.runtime || !chrome.runtime.sendMessage) {
          console.log("Using mock data (development mode)");
          setHighlights(mockHighlights);
          setLoading(false);
          return;
        }

        // Request highlights from the background script
        chrome.runtime.sendMessage(
          { action: "getHighlights" },
          (response: Highlight[]) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error fetching highlights:",
                chrome.runtime.lastError
              );
              setHighlights([]);
            } else {
              setHighlights(response || []);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Failed to load highlights:", error);
        setHighlights([]);
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
        <HighlightsContainer initialHighlights={highlights} />
      )}
    </div>
  );
}

export default App;
