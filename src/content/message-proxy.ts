import { getSelectionInfo } from "./highlight-utils";

/** Initialize message handler to forward selection info requests */
export function initMessageProxy(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "getSelectionInfo") {
      const info = getSelectionInfo();
      sendResponse(info);
    }
    // Indicate async response if needed
    return true;
  });
}
