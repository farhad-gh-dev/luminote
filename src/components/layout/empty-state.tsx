import React from "react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No highlights yet. Select text on any webpage to save it.",
}) => {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
