import React from "react";
import SelectionToolbar from "@/components/layout/selection-toolbar";

interface ContentUIProps {
  selection: Selection;
  onHighlight: () => void;
}

/**
 * Root component for the content script UI
 */
const ContentUI: React.FC<ContentUIProps> = ({ onHighlight }) => {
  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] relative">
      <SelectionToolbar onHighlight={onHighlight} />
    </div>
  );
};

export default ContentUI;
