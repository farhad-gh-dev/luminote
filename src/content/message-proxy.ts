import browser from "webextension-polyfill";
import { getSelectionInfo } from "./utils/selection-utils";
import { MessageActions } from "@/constants/message-actions";
import type { Message } from "@/types";
import { removeHighlightFromDOM } from "./utils/dom-highlight-utils";

/** Initialize message handler to forward selection info requests */
export function initMessageProxy(): void {
  browser.runtime.onMessage.addListener(
    (message: unknown, _sender, sendResponse) => {
      const msg = message as Message;

      if (msg.action === MessageActions.GET_SELECTION_INFO) {
        const info = getSelectionInfo();
        sendResponse(info);
      } else if (
        msg.action === MessageActions.HIGHLIGHT_DELETED &&
        msg.highlight
      ) {
        // When a highlight is deleted, remove it from the DOM
        removeHighlightFromDOM(msg.highlight.text);
        console.log(`Removed highlight from DOM: ${msg.highlight.text}`);
      }

      // Indicate async response if needed
      return true;
    }
  );
}
