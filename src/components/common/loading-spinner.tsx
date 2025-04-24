import React from "react";
import classNames from "classnames";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  const colorStyles = {
    primary: "border-indigo-600 border-t-transparent",
    secondary: "border-gray-400 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className={classNames("flex items-center justify-center", className)}>
      <div
        className={classNames(
          "animate-spin rounded-full",
          sizeStyles[size],
          colorStyles[color]
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
