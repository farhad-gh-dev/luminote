import { initializeContextMenu } from "./context-menu-manager";
import { initializeMessageHandler } from "./message-handler";

/**
 * Initialize the background script
 * Handles setup of message listeners and context menus
 */
async function initializeBackgroundScript(): Promise<void> {
  try {
    // Initialize message handlers and context menus
    initializeMessageHandler();
    initializeContextMenu();

    console.log("Luminote background script initialized successfully");
  } catch (error) {
    console.error("Error initializing background script:", error);
  }
}

initializeBackgroundScript();
