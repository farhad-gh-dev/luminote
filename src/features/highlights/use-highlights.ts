import { useContext } from "react";
import { HighlightsContext, HighlightsContextType } from "./highlights-state";

export function useHighlights(): HighlightsContextType {
  const context = useContext(HighlightsContext);

  if (context === undefined) {
    throw new Error(
      "useHighlights hook must be used within a HighlightsProvider component"
    );
  }

  return context;
}
