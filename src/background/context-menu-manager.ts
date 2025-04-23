import browser from "webextension-polyfill";
import { saveHighlight } from "@/services/highlight-service";
import { MessageActions } from "@/constants/message-actions";
import { MenuIds } from "@/constants";
import type { Highlight } from "@/types";

async function saveSelectionFromTab(tab: browser.Tabs.Tab): Promise<void> {
  if (!tab.id) return;

  try {
    const response = (await browser.tabs.sendMessage(tab.id, {
      action: MessageActions.GET_SELECTION_INFO,
    })) as { text: string };

    if (response && response.text) {
      const highlight: Highlight = {
        id: crypto.randomUUID(),
        text: response.text,
        url: tab.url || "",
        title: tab.title || "",
        createdAt: new Date().toISOString(),
      };

      await saveHighlight(highlight);

      // Notify the extension popup if it's open
      await browser.runtime
        .sendMessage({
          action: MessageActions.HIGHLIGHT_SAVED,
          highlight,
        })
        .catch(() => {
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
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: MenuIds.HIGHLIGHT_SELECTION,
      title: "Save to Luminote",
      contexts: ["selection"],
    });
  });

  // Handle context menu clicks
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MenuIds.HIGHLIGHT_SELECTION && tab && tab.id) {
      saveSelectionFromTab(tab);
    }
  });
}
