import { isExtensionEnvironment, runtimeSendMessage } from "./chrome-adapter";
import type { Highlight } from "../types";
import { MessageActions } from "../constants/message-actions";

// Provides an API for UI components (like popup) to communicate
// with the background script via messages. Does not interact directly with storage.

/**
 * Fetch highlights from the background script
 */
export async function getHighlights(): Promise<Highlight[]> {
  if (!isExtensionEnvironment()) {
    console.log("Using mock data (development mode)");
    return [];
  }
  try {
    const response = await runtimeSendMessage<Highlight[]>({
      action: MessageActions.GET_HIGHLIGHTS,
    });
    return response || [];
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return [];
  }
}

/**
 * Save a highlight via the background script
 */
export async function saveHighlight(highlight: Highlight): Promise<boolean> {
  if (!isExtensionEnvironment()) {
    console.log("Mock save highlight (development mode)");
    return true;
  }
  try {
    await runtimeSendMessage<boolean>({
      action: MessageActions.SAVE_HIGHLIGHT,
      highlight,
    });
    return true;
  } catch (error) {
    console.error("Error saving highlight:", error);
    return false;
  }
}

/**
 * Delete a highlight via the background script
 */
export async function deleteHighlight(id: string): Promise<boolean> {
  if (!isExtensionEnvironment()) {
    console.log("Mock delete highlight (development mode)");
    return true;
  }
  try {
    await runtimeSendMessage<boolean>({
      action: MessageActions.DELETE_HIGHLIGHT,
      id,
    });
    return true;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return false;
  }
}
