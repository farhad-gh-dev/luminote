/**
 * This script handles:
 * - Text selection detection
 * - Highlighting UI management
 * - Communication with background script
 */
import { initSelectionObserver } from "./selection-observer";
import { initPopupController } from "./ui/popup-controller";
import { initMessageProxy } from "./message-proxy";
import { injectStyles } from "./utils/dom-highlight-utils";
import { loadAndApplyStoredHighlights } from "./utils/highlight-storage";
import "./styles/content.css";

const cleanupFunctions: Array<() => void> = [];

function initialize(): void {
  injectStyles();
  initMessageProxy();

  const cleanupSelectionObserver = initSelectionObserver();
  cleanupFunctions.push(cleanupSelectionObserver);

  initPopupController();

  // Wait for DOM content to be fully loaded before applying highlights
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHighlightsWhenReady);
  } else {
    applyHighlightsWhenReady();
  }

  window.addEventListener("unload", cleanup);
}

function applyHighlightsWhenReady(): void {
  setTimeout(() => {
    loadAndApplyStoredHighlights()
      .then(() => console.log("Stored highlights applied successfully"))
      .catch((error) =>
        console.error("Error applying stored highlights:", error)
      );
  }, 500);
}

function cleanup(): void {
  console.log("Luminote content script unloading, cleaning up...");
  cleanupFunctions.forEach((cleanupFn) => cleanupFn());
}

initialize();
