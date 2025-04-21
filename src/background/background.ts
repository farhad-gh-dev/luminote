import { initializeContextMenu } from "./context-menu-manager";
import { initializeMessageHandler } from "./message-handler";

/**
 * Initialize the background script
 * Handles setup of message listeners and context menus
 */
function initializeBackgroundScript(): void {
  try {
    initializeMessageHandler();

    initializeContextMenu();

    console.log("Luminote background script initialized successfully");
  } catch (error) {
    console.error("Error initializing background script:", error);
  }
}

initializeBackgroundScript();
