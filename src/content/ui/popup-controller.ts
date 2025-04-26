import {
  renderAddHighlightUI,
  renderManageHighlightUI,
} from "./shadow-dom-renderer";
import {
  getSelectionInfo,
  createHighlightFromSelection,
} from "../utils/selection-utils";
import {
  applyHighlightStyling,
  removeHighlightFromDOM,
} from "../utils/dom-highlight-utils";
import { saveHighlightToStorage } from "../utils/highlight-storage";
import browser from "webextension-polyfill";
import { MessageActions } from "@/constants/message-actions";
import { getHighlightsByUrl } from "@/services/chrome-api";

let currentUICleanup: (() => void) | null = null;
let currentSelection: Selection | null = null;
let currentHighlightText: string | null = null;

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

export function handleDeleteHighlight(): void {
  if (!currentHighlightText) return;

  const text = currentHighlightText;

  // Find the highlight with this text in the current page
  getHighlightsByUrl(window.location.href)
    .then((highlights) => {
      const highlight = highlights.find((h) => h.text === text);

      if (highlight && highlight.id) {
        // Delete the highlight from storage
        browser.runtime
          .sendMessage({
            action: MessageActions.DELETE_HIGHLIGHT,
            id: highlight.id,
          })
          .then(() => {
            console.log("Highlight deleted successfully");
            // Remove the highlight styling from DOM
            removeHighlightFromDOM(text);
          })
          .catch((error) => {
            console.error("Failed to delete highlight:", error);
            // Show error message to user (could implement toast notification here)
          });
      } else {
        console.warn("Could not find highlight with text:", text);
        // Still remove from DOM since the user clicked delete
        removeHighlightFromDOM(text);
      }
    })
    .catch((error) => {
      console.error("Failed to get highlights:", error);
      // Still try to remove the highlight from DOM
      removeHighlightFromDOM(text);
    })
    .finally(() => {
      removeContentUI();
    });
}

export function showAddHighlightUI(
  selection: Selection,
  mousePosition: { x: number; y: number }
): void {
  // Clean up any existing UI
  removeContentUI();

  if (!selection || selection.toString().trim() === "") {
    return;
  }

  currentSelection = selection;

  // Render React UI in Shadow DOM, passing mouse position
  const { cleanup } = renderAddHighlightUI(
    selection,
    handleSaveHighlight,
    mousePosition
  );
  currentUICleanup = cleanup;
}

export function showManageHighlightUI(
  highlightText: string,
  mousePosition: { x: number; y: number }
): void {
  // Clean up any existing UI
  removeContentUI();

  currentHighlightText = highlightText;

  // Render React UI in Shadow DOM, passing mouse position
  const { cleanup } = renderManageHighlightUI(
    handleDeleteHighlight,
    mousePosition
  );
  currentUICleanup = cleanup;
}

export function removeContentUI(): void {
  if (currentUICleanup) {
    currentUICleanup();
    currentUICleanup = null;
    currentSelection = null;
    currentHighlightText = null;
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

  // Add click handler for highlighted texts
  document.addEventListener("click", (event) => {
    // Skip if there's already an active UI
    if (currentUICleanup) return;

    const target = event.target as Element;

    // Check if a highlighted text was clicked
    if (
      target &&
      target.classList &&
      target.classList.contains("luminote-highlighted-text")
    ) {
      // Prevent default behavior and stop propagation to avoid text selection
      event.preventDefault();
      event.stopPropagation();

      const highlightText = target.textContent || "";

      if (highlightText.trim() !== "") {
        showManageHighlightUI(highlightText, {
          x: event.pageX,
          y: event.pageY,
        });
      }
    }
  });
}
