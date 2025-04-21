interface Highlight {
  id: string;
  text: string;
  url: string;
  title: string;
  createdAt: string;
  tags?: string[];
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "saveHighlight") {
    handleSaveHighlight(message.highlight);
  } else if (message.action === "getHighlights") {
    handleGetHighlights().then(sendResponse);
    return true; // Return true for async response
  } else if (message.action === "deleteHighlight") {
    handleDeleteHighlight(message.id).then(sendResponse);
    return true; // Return true for async response
  }
});

// Handle saving a highlight
async function handleSaveHighlight(highlight: Highlight): Promise<void> {
  try {
    // Get existing highlights
    const { highlights = [] } = await chrome.storage.sync.get("highlights");

    // Add the new highlight to the beginning of the array
    const updatedHighlights = [highlight, ...highlights];

    // Store the updated highlights
    await chrome.storage.sync.set({ highlights: updatedHighlights });

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
    console.error("Error saving highlight:", error);
  }
}

// Handle retrieving all highlights
async function handleGetHighlights(): Promise<Highlight[]> {
  try {
    const { highlights = [] } = await chrome.storage.sync.get("highlights");
    return highlights;
  } catch (error) {
    console.error("Error getting highlights:", error);
    return [];
  }
}

// Handle deleting a highlight
async function handleDeleteHighlight(id: string): Promise<boolean> {
  try {
    // Get existing highlights
    const { highlights = [] } = await chrome.storage.sync.get("highlights");

    // Filter out the highlight to delete
    const updatedHighlights = highlights.filter(
      (highlight: Highlight) => highlight.id !== id
    );

    // Store the updated highlights
    await chrome.storage.sync.set({ highlights: updatedHighlights });

    return true;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return false;
  }
}

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

// Helper function to save selection from a tab
function saveSelectionFromTab(tab: chrome.tabs.Tab): void {
  if (!tab.id) return;

  chrome.tabs.sendMessage(
    tab.id,
    { action: "getSelectionInfo" },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        return;
      }

      if (response) {
        const highlight: Highlight = {
          id: crypto.randomUUID(),
          text: response.text,
          url: tab.url || "",
          title: tab.title || "",
          createdAt: new Date().toISOString(),
        };

        handleSaveHighlight(highlight);
      }
    }
  );
}

console.log("Luminote background script loaded");
