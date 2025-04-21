import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-400 text-center">
        No highlights yet. Select text on any webpage to save it.
      </p>
    </div>
  );
};

export default EmptyState;
