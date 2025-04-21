import { Highlight } from "../types";
import { saveHighlight } from "../services/highlight-service";

/**
 * Save selected text from a tab
 */
function saveSelectionFromTab(tab: chrome.tabs.Tab): void {
  if (!tab.id) return;

  chrome.tabs.sendMessage(
    tab.id,
    { action: "getSelectionInfo" },
    async (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        return;
      }

      if (response) {
        try {
          const highlight: Highlight = {
            id: crypto.randomUUID(),
            text: response.text,
            url: tab.url || "",
            title: tab.title || "",
            createdAt: new Date().toISOString(),
          };

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
          console.error("Failed to save selection:", error);
        }
      }
    }
  );
}

/**
 * Initialize the context menu
 */
export function initializeContextMenu(): void {
  // Set up context menu
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "highlightSelection",
      title: "Save to Luminote",
      contexts: ["selection"],
    });
  });

  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightSelection" && tab && tab.id) {
      saveSelectionFromTab(tab);
    }
  });
}
