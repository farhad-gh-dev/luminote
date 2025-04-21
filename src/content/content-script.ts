/**
 * This script handles:
 * - Text selection detection
 * - Highlighting UI management
 * - Communication with background script
 */
import { injectStyles } from "./ui-components";
import { initSelectionObserver } from "./selection-observer";
import { initPopupController } from "./popup-controller";
import { initMessageProxy } from "./message-proxy";

// Initialize content script by wiring up concerns
function initialize(): void {
  injectStyles();
  initMessageProxy();
  initSelectionObserver();
  initPopupController();
  console.log("Luminote content script loaded");
}

initialize();
