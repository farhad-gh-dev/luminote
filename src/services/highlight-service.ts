import { db } from "./db";
import type { Highlight } from "@/types";

export async function getHighlights(): Promise<Highlight[]> {
  try {
    return await db.getAllHighlights();
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
    await db.addHighlight(highlight);
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
    await db.deleteHighlight(id);
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

export async function updateHighlight(highlight: Highlight): Promise<boolean> {
  try {
    await db.updateHighlight(highlight);
    return true;
  } catch (error) {
    console.error("Error updating highlight:", error);
    throw new Error(
      `Failed to update highlight: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function searchHighlights(
  searchText: string
): Promise<Highlight[]> {
  try {
    return await db.searchHighlights(searchText);
  } catch (error) {
    console.error("Error searching highlights:", error);
    throw new Error(
      `Failed to search highlights: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function getHighlightsByUrl(url: string): Promise<Highlight[]> {
  try {
    return await db.getHighlightsByUrl(url);
  } catch (error) {
    console.error("Error getting highlights by URL:", error);
    throw new Error(
      `Failed to get highlights by URL: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
