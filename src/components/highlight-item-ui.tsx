import React from "react";
import classNames from "classnames";

// Interface for the UI props of a highlight item
export interface HighlightItemUIProps {
  id: string;
  text: string;
  url: string;
  title: string;
  formattedDate: string;
  color?: string;
  hostname: string;
  onDelete: (id: string) => void;
}

const HighlightItemUI: React.FC<HighlightItemUIProps> = ({
  id,
  text,
  url,
  title,
  formattedDate,
  color,
  hostname,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-700 truncate flex-grow">
          {title}
        </h3>
        <span
          className={classNames("inline-block w-3 h-3 rounded-full", {
            "bg-amber-300": color === "yellow",
            "bg-emerald-300": color === "green",
            "bg-sky-300": color === "blue",
            "bg-violet-300": !color || color === "purple",
          })}
        />
      </div>

      <div className="pl-2 border-l-2 border-indigo-200 mb-2">
        <p className="text-sm text-gray-600">{text}</p>
      </div>

      <div className="flex justify-between items-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-500 hover:text-indigo-700 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px]"
        >
          {hostname}
        </a>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <button
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete highlight"
            aria-label="Delete highlight"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightItemUI;
