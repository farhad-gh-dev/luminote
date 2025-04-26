import browser from "webextension-polyfill";
import {
  saveHighlight,
  getHighlights,
  deleteHighlight,
  getHighlightsByUrl,
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
    // Get the highlight before deleting to send notification with highlight text
    const highlights = await getHighlights();
    const highlight = highlights.find((h) => h.id === id);

    const result = await deleteHighlight(id);

    if (result && highlight) {
      // Notify all tabs that may have this highlight
      const tabs = await browser.tabs.query({});
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.tabs
            .sendMessage(tab.id, {
              action: MessageActions.HIGHLIGHT_DELETED,
              highlight,
            })
            .catch(() => {
              // Ignore errors if content script is not available on this tab
            });
        }
      });
    }

    return result;
  } catch (error) {
    console.error("Error in handleDeleteHighlight:", error);
    return false;
  }
}

async function handleGetHighlightsByUrl(url: string): Promise<Highlight[]> {
  try {
    return await getHighlightsByUrl(url);
  } catch (error) {
    console.error("Error in handleGetHighlightsByUrl:", error);
    return [];
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

        case MessageActions.GET_HIGHLIGHTS_BY_URL:
          if (msg.url) {
            handleGetHighlightsByUrl(msg.url).then(sendResponse);
          } else {
            // If no URL is provided, return empty array
            sendResponse([]);
          }
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
