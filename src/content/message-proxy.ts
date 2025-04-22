import { getSelectionInfo } from "./highlight-utils";

const GET_SELECTION_INFO = "getSelectionInfo";

/** Initialize message handler to forward selection info requests */
export function initMessageProxy(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === GET_SELECTION_INFO) {
      const info = getSelectionInfo();
      sendResponse(info);
    }
    // Indicate async response if needed
    return true;
  });
}
