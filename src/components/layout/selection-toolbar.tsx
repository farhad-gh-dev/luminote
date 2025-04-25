import React from "react";
import Button from "@/components/common/button";

interface SelectionToolbarProps {
  onHighlight: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ onHighlight }) => {
  return (
    <div className="flex flex-col gap-2 p-2 rounded-md shadow-lg bg-white">
      <Button variant="primary" size="md" onClick={onHighlight}>
        Highlight
      </Button>
    </div>
  );
};

export default SelectionToolbar;
