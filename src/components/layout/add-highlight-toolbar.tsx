import React from "react";
import Button from "@/components/common/button";

interface AddHighlightToolbarProps {
  onHighlight: () => void;
}

const AddHighlightToolbar: React.FC<AddHighlightToolbarProps> = ({
  onHighlight,
}) => {
  return (
    <div className="bg-transparent">
      <Button variant="primary" size="md" onClick={onHighlight}>
        Highlight
      </Button>
    </div>
  );
};

export default AddHighlightToolbar;
