import { Highlight } from "../types";
import { saveHighlight } from "../services/highlight-service";
import { runtimeSendMessage, tabSendMessage } from "../services/chrome-adapter";
import { MessageActions } from "../constants/message-actions";
import { MenuIds } from "../constants";

async function saveSelectionFromTab(tab: chrome.tabs.Tab): Promise<void> {
  if (!tab.id) return;

  try {
    const response = await tabSendMessage<{ text: string }>(tab.id, {
      action: MessageActions.GET_SELECTION_INFO,
    });

    if (response && response.text) {
      const highlight: Highlight = {
        id: crypto.randomUUID(),
        text: response.text,
        url: tab.url || "",
        title: tab.title || "",
        createdAt: new Date().toISOString(),
      };

      await saveHighlight(highlight);

      // Notify the extension popup if it's open using runtimeSendMessage
      await runtimeSendMessage({
        action: MessageActions.HIGHLIGHT_SAVED,
        highlight,
      }).catch(() => {
        // Ignore error if popup is not open or cannot receive the message
        console.log(
          "Popup not open or unable to receive 'highlightSaved' message."
        );
      });
    } else {
      console.log("No text selected or received from tab:", tab.id);
    }
  } catch (error) {
    console.error("Error saving selection from tab:", tab.id, error);
  }
}

export function initializeContextMenu(): void {
  // Set up context menu
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: MenuIds.HIGHLIGHT_SELECTION,
      title: "Save to Luminote",
      contexts: ["selection"],
    });
  });

  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MenuIds.HIGHLIGHT_SELECTION && tab && tab.id) {
      saveSelectionFromTab(tab);
    }
  });
}
