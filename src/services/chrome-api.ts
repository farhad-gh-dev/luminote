import { isExtensionEnvironment, sendMessage } from "./chrome-adapter";
import type { Highlight } from "../types";

/**
 * Fetch highlights from the background script
 */
export async function getHighlights(): Promise<Highlight[]> {
  if (!isExtensionEnvironment()) {
    console.log("Using mock data (development mode)");
    return [];
  }
  try {
    const response = await sendMessage<Highlight[]>({
      action: "getHighlights",
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
    await sendMessage<boolean>({
      action: "saveHighlight",
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
    await sendMessage<boolean>({
      action: "deleteHighlight",
      id,
    });
    return true;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return false;
  }
}
