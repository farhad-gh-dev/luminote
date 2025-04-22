import { Highlight, Message } from "../types";
import {
  saveHighlight,
  getHighlights,
  deleteHighlight,
} from "../services/highlight-service";
import { MessageActions } from "../constants/message-actions";

async function handleSaveHighlight(highlight: Highlight): Promise<void> {
  try {
    await saveHighlight(highlight);

    // Notify the extension popup if it's open
    chrome.runtime
      .sendMessage({
        action: MessageActions.HIGHLIGHT_SAVED,
        highlight,
      })
      .catch(() => {
        // Ignore error if popup is not open
      });
  } catch (error) {
    console.error("Error in handleSaveHighlight:", error);
  }
}

async function handleGetHighlights(): Promise<Highlight[]> {
  try {
    return await getHighlights();
  } catch (error) {
    console.error("Error in handleGetHighlights:", error);
    return [];
  }
}

async function handleDeleteHighlight(id: string): Promise<boolean> {
  try {
    return await deleteHighlight(id);
  } catch (error) {
    console.error("Error in handleDeleteHighlight:", error);
    return false;
  }
}

export function initializeMessageHandler(): void {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      switch (message.action) {
        case MessageActions.SAVE_HIGHLIGHT:
          if (message.highlight) {
            handleSaveHighlight(message.highlight);
          }
          break;

        case MessageActions.GET_HIGHLIGHTS:
          handleGetHighlights().then(sendResponse);
          return true; // Return true for async response

        case MessageActions.DELETE_HIGHLIGHT:
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
