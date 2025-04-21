import { Highlight } from "../types";
import { storageGet, storageSet } from "./chrome-adapter";

/**
 * Stores a highlight in Chrome storage
 */
export async function saveHighlight(highlight: Highlight): Promise<void> {
  try {
    const result = await storageGet<{ highlights?: Highlight[] }>("highlights");
    const highlights = result.highlights || [];
    const updatedHighlights = [highlight, ...highlights];
    await storageSet({ highlights: updatedHighlights });
  } catch (error) {
    console.error("Error saving highlight:", error);
    throw new Error(
      `Failed to save highlight: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Retrieves all highlights from Chrome storage
 */
export async function getHighlights(): Promise<Highlight[]> {
  try {
    const result = await storageGet<{ highlights?: Highlight[] }>("highlights");
    return result.highlights || [];
  } catch (error) {
    console.error("Error retrieving highlights:", error);
    throw new Error(
      `Failed to retrieve highlights: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Deletes a highlight from Chrome storage
 */
export async function deleteHighlight(id: string): Promise<boolean> {
  try {
    const result = await storageGet<{ highlights?: Highlight[] }>("highlights");
    const highlights = result.highlights || [];
    const updatedHighlights = highlights.filter(
      (highlight: Highlight) => highlight.id !== id
    );

    await storageSet({ highlights: updatedHighlights });
    return true;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    throw new Error(
      `Failed to delete highlight: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
