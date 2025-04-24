import React from "react";
import LoadingSpinner from "./loading-spinner";
import classNames from "classnames";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = false,
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center",
        fullScreen ? "fixed inset-0 z-50 bg-white bg-opacity-80" : "h-full",
        className
      )}
    >
      <LoadingSpinner size={size} />
      {message && <p className="mt-2 text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default Loading;
