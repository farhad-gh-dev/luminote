import { renderContentUI } from "@/content/shadow-dom-renderer";
import {
  getSelectionInfo,
  applyHighlightStyling,
  createHighlightFromSelection,
  saveHighlightToStorage,
} from "./highlight-utils";

let currentUICleanup: (() => void) | null = null;
let currentSelection: Selection | null = null;

export function handleSaveHighlight(): void {
  if (!currentSelection) return;

  const selectionInfo = getSelectionInfo();
  if (!selectionInfo) return;

  const highlight = createHighlightFromSelection(selectionInfo);

  applyHighlightStyling(currentSelection);

  saveHighlightToStorage(highlight)
    .then(() => console.log("Highlight saved successfully"))
    .catch((error) => console.error("Failed to save highlight:", error));

  removeContentUI();
}

export function showContentUI(selection: Selection): void {
  // Clean up any existing UI
  removeContentUI();

  if (!selection || selection.toString().trim() === "") {
    return;
  }

  currentSelection = selection;

  // Render React UI in Shadow DOM
  const { cleanup } = renderContentUI(selection, handleSaveHighlight);
  currentUICleanup = cleanup;
}

export function removeContentUI(): void {
  if (currentUICleanup) {
    currentUICleanup();
    currentUICleanup = null;
    currentSelection = null;
  }
}

export function initPopupController(): void {
  // Handle clicks outside the popup to remove it
  document.addEventListener("click", (event) => {
    // Skip if there's no active UI
    if (!currentUICleanup) return;

    // Get the element that was clicked
    const target = event.target as Node;

    // Determine if click was inside our UI container
    const container = document.getElementById("luminote-content-ui-container");
    if (container && container.contains(target)) {
      return;
    }

    // If we get here, the click was outside our UI
    removeContentUI();
  });
}
