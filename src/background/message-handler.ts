import { Highlight, Message } from "../types";
import {
  saveHighlight,
  getHighlights,
  deleteHighlight,
} from "../services/highlight-service";

/**
 * Handle saving a highlight
 */
async function handleSaveHighlight(highlight: Highlight): Promise<void> {
  try {
    await saveHighlight(highlight);

    // Notify the extension popup if it's open
    chrome.runtime
      .sendMessage({
        action: "highlightSaved",
        highlight,
      })
      .catch(() => {
        // Ignore error if popup is not open
      });
  } catch (error) {
    console.error("Error in handleSaveHighlight:", error);
  }
}

/**
 * Handle retrieving all highlights
 */
async function handleGetHighlights(): Promise<Highlight[]> {
  try {
    return await getHighlights();
  } catch (error) {
    console.error("Error in handleGetHighlights:", error);
    return [];
  }
}

/**
 * Handle deleting a highlight
 */
async function handleDeleteHighlight(id: string): Promise<boolean> {
  try {
    return await deleteHighlight(id);
  } catch (error) {
    console.error("Error in handleDeleteHighlight:", error);
    return false;
  }
}

/**
 * Initialize the message handler
 */
export function initializeMessageHandler(): void {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      switch (message.action) {
        case "saveHighlight":
          if (message.highlight) {
            handleSaveHighlight(message.highlight);
          }
          break;

        case "getHighlights":
          handleGetHighlights().then(sendResponse);
          return true; // Return true for async response

        case "deleteHighlight":
          if (message.id) {
            handleDeleteHighlight(message.id).then(sendResponse);
            return true; // Return true for async response
          }
          break;

        default:
          console.warn(`Unknown message action: ${message.action}`);
      }
    }
  );
}
