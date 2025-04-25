/**
 * This script handles:
 * - Text selection detection
 * - Highlighting UI management
 * - Communication with background script
 */
import { initSelectionObserver } from "./selection-observer";
import { initPopupController } from "./popup-controller";
import { initMessageProxy } from "./message-proxy";
import { injectStyles } from "./highlight-utils";
import "./content.css";

// Initialize content script by wiring up concerns
function initialize(): void {
  injectStyles();
  initMessageProxy();
  initSelectionObserver();
  initPopupController();
  console.log("Luminote content script loaded");
}

initialize();
