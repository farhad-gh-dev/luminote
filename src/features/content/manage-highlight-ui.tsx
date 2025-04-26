import React from "react";
import TrashIcon from "@/components/icons/trash-icon";

interface ManageHighlightUIProps {
  onDelete: () => void;
}

/**
 * Component for managing an existing highlight
 */
const ManageHighlightUI: React.FC<ManageHighlightUIProps> = ({ onDelete }) => {
  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] relative bg-white shadow-lg rounded-lg p-2 border border-gray-200">
      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors duration-200"
        title="Delete highlight"
      >
        <TrashIcon className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ManageHighlightUI;
