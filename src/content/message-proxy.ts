import browser from "webextension-polyfill";
import { getSelectionInfo } from "@/content/highlight-utils";
import { MessageActions } from "@/constants/message-actions";
import type { Message } from "@/types";

/** Initialize message handler to forward selection info requests */
export function initMessageProxy(): void {
  browser.runtime.onMessage.addListener(
    (message: unknown, _sender, sendResponse) => {
      const msg = message as Message;
      if (msg.action === MessageActions.GET_SELECTION_INFO) {
        const info = getSelectionInfo();
        sendResponse(info);
      }
      // Indicate async response if needed
      return true;
    }
  );
}
