import browser from "webextension-polyfill";
import { MessageActions } from "@/constants/message-actions";
import type { Highlight } from "@/types";

// Provides an API for UI components (like popup) to communicate
// with the background script via messages. Does not interact directly with storage.

export async function getHighlights(): Promise<Highlight[]> {
  try {
    const response = await browser.runtime.sendMessage({
      action: MessageActions.GET_HIGHLIGHTS,
    });
    return (response as Highlight[]) || [];
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return [];
  }
}

export async function saveHighlight(highlight: Highlight): Promise<boolean> {
  try {
    await browser.runtime.sendMessage({
      action: MessageActions.SAVE_HIGHLIGHT,
      highlight,
    });
    return true;
  } catch (error) {
    console.error("Error saving highlight:", error);
    return false;
  }
}

export async function deleteHighlight(id: string): Promise<boolean> {
  try {
    await browser.runtime.sendMessage({
      action: MessageActions.DELETE_HIGHLIGHT,
      id,
    });
    return true;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return false;
  }
}
