import Dexie, { Table } from "dexie";
import type { Highlight } from "@/types";

/**
 * LumiNoteDatabase - The main database class for the LumiNote app using Dexie.js
 * This handles all database operations for highlights and related data
 */
export class LumiNoteDatabase extends Dexie {
  highlights!: Table<Highlight>;

  constructor() {
    super("LumiNoteDB");

    this.version(1).stores({
      highlights: "&id, text, url, title, createdAt, *tags",
      // The '&' denotes a primary key, and '*' denotes a multi-entry index for array values
    });
  }

  async getAllHighlights(): Promise<Highlight[]> {
    return await this.highlights.toArray();
  }

  async addHighlight(highlight: Highlight): Promise<string> {
    return await this.highlights.add(highlight);
  }

  async updateHighlight(highlight: Highlight): Promise<number> {
    return await this.highlights.update(highlight.id, highlight);
  }

  async deleteHighlight(id: string): Promise<void> {
    await this.highlights.delete(id);
  }

  async getHighlightsByUrl(url: string): Promise<Highlight[]> {
    return await this.highlights.where("url").equals(url).toArray();
  }
}

export const db = new LumiNoteDatabase();
