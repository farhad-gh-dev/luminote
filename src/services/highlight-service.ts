import browser from "webextension-polyfill";
import { StorageKeys } from "@/constants";
import type { Highlight } from "@/types";

// to manage highlights. Primarily used by the background script.

export async function getHighlights(): Promise<Highlight[]> {
  try {
    const result = await browser.storage.sync.get(StorageKeys.HIGHLIGHTS);
    return (result as { highlights?: Highlight[] }).highlights || [];
  } catch (error) {
    console.error("Error retrieving highlights:", error);
    throw new Error(
      `Failed to retrieve highlights: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function saveHighlight(highlight: Highlight): Promise<void> {
  try {
    const result = await browser.storage.sync.get(StorageKeys.HIGHLIGHTS);
    const highlights =
      (result as { highlights?: Highlight[] }).highlights || [];
    const updatedHighlights = [highlight, ...highlights];
    await browser.storage.sync.set({
      [StorageKeys.HIGHLIGHTS]: updatedHighlights,
    });
  } catch (error) {
    console.error("Error saving highlight:", error);
    throw new Error(
      `Failed to save highlight: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function deleteHighlight(id: string): Promise<boolean> {
  try {
    const result = await browser.storage.sync.get(StorageKeys.HIGHLIGHTS);
    const highlights =
      (result as { highlights?: Highlight[] }).highlights || [];
    const updatedHighlights = highlights.filter(
      (highlight: Highlight) => highlight.id !== id
    );

    await browser.storage.sync.set({
      [StorageKeys.HIGHLIGHTS]: updatedHighlights,
    });
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
