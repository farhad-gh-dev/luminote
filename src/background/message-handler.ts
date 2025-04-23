import browser from "webextension-polyfill";
import {
  saveHighlight,
  getHighlights,
  deleteHighlight,
} from "@/services/highlight-service";
import { MessageActions } from "@/constants/message-actions";
import type { Highlight, Message } from "@/types";

async function handleSaveHighlight(highlight: Highlight): Promise<boolean> {
  try {
    await saveHighlight(highlight);

    // Notify the extension popup if it's open
    await browser.runtime
      .sendMessage({ action: MessageActions.HIGHLIGHT_SAVED, highlight })
      .catch(() => {
        // Ignore error if popup is not open
      });
    return true;
  } catch (error) {
    console.error("Error in handleSaveHighlight:", error);
    return false;
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
  browser.runtime.onMessage.addListener(
    (
      message: unknown,
      _sender: browser.Runtime.MessageSender,
      sendResponse: (response: unknown) => void
    ): true => {
      const msg = message as Message;

      switch (msg.action) {
        case MessageActions.SAVE_HIGHLIGHT:
          if (msg.highlight) {
            handleSaveHighlight(msg.highlight).then(sendResponse);
          }
          break;

        case MessageActions.GET_HIGHLIGHTS:
          handleGetHighlights().then(sendResponse);
          break;

        case MessageActions.DELETE_HIGHLIGHT:
          if (msg.id) {
            handleDeleteHighlight(msg.id).then(sendResponse);
          }
          break;

        default:
          console.warn(`Unknown message action: ${msg.action}`);
      }

      // Always return true so TS sees your callback returns the literal `true`
      return true;
    }
  );
}
