import { getCurrentSelection, removeHighlightPopup } from "./ui-components";
import {
  getSelectionInfo,
  applyHighlightStyling,
  createHighlightFromSelection,
  saveHighlightToStorage,
} from "./highlight-utils";

/** Handles user action to save a new highlight */
export function handleSaveHighlight(): void {
  const selection = getCurrentSelection();
  if (!selection) return;

  const selectionInfo = getSelectionInfo();
  if (!selectionInfo) return;

  const highlight = createHighlightFromSelection(selectionInfo);

  applyHighlightStyling(selection);

  saveHighlightToStorage(highlight)
    .then(() => console.log("Highlight saved successfully"))
    .catch((error) => console.error("Failed to save highlight:", error));

  removeHighlightPopup();
}

/** No additional setup needed; click wiring happens in UI component */
export function initPopupController(): void {
  // noop
}
