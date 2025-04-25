import React from "react";
import classNames from "classnames";
import LoadingSpinner from "@/components/common/loading-spinner";
import TrashIcon from "@/components/icons/trash-icon";

// Interface for the UI props of a highlight item
export interface HighlightItemUIProps {
  id: string;
  text: string;
  url: string;
  title: string;
  formattedDate: string;
  color?: string;
  hostname: string;
  websiteTitle?: string;
  websiteIconUrl?: string;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const HighlightItemUI: React.FC<HighlightItemUIProps> = ({
  id,
  text,
  url,
  title,
  formattedDate,
  color,
  hostname,
  websiteTitle,
  websiteIconUrl,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative group">
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-gray-800 truncate flex-grow pr-2">
          {title}
        </h3>
        <span
          className={classNames("inline-block w-4 h-4 rounded-full shadow-sm", {
            "bg-amber-400": color === "yellow",
            "bg-emerald-400": color === "green",
            "bg-sky-400": color === "blue",
            "bg-violet-400": !color || color === "purple",
          })}
        />
      </div>

      <div className="pl-3 border-l-3 border-indigo-300 mb-3 hover:border-indigo-500 transition-colors duration-200">
        <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
      </div>

      <div className="flex justify-between items-center mt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:text-indigo-800 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px] flex items-center gap-2 transition-colors duration-200"
        >
          {websiteIconUrl && (
            <img
              src={websiteIconUrl}
              alt={websiteTitle || hostname}
              className="w-4 h-4 rounded"
              onError={(e) => {
                // Hide the image if it fails to load
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span>{websiteTitle || hostname}</span>
        </a>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all duration-200 opacity-70 group-hover:opacity-100"
            title="Delete highlight"
            aria-label="Delete highlight"
            disabled={isDeleting}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightItemUI;
