import React from "react";
import AddHighlightToolbar from "@/components/layout/add-highlight-toolbar";

interface AddHighlightUIProps {
  selection: Selection;
  onHighlight: () => void;
}

/**
 * Root component for the content script UI
 */
const AddHighlightUI: React.FC<AddHighlightUIProps> = ({ onHighlight }) => {
  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] relative">
      <AddHighlightToolbar onHighlight={onHighlight} />
    </div>
  );
};

export default AddHighlightUI;
