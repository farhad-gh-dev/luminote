import { Message } from "../types";
import { getSelectionInfo } from "./highlight-utils";

// MessageActions constant obj can not be used for contact-script modules due to seperate bundling
const GET_SELECTION_INFO = "getSelectionInfo";

/** Initialize message handler to forward selection info requests */
export function initMessageProxy(): void {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      if (message.action === GET_SELECTION_INFO) {
        const info = getSelectionInfo();
        sendResponse(info);
      }
      // Indicate async response if needed
      return true;
    }
  );
}
