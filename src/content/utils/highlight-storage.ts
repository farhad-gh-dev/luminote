// Utilities for storage and retrieval of highlights

import browser from "webextension-polyfill";
import { MessageActions } from "@/constants/message-actions";
import type { Highlight } from "@/types";
import { findAndHighlightText } from "./dom-highlight-utils";

export function saveHighlightToStorage(highlight: Highlight): Promise<void> {
  return browser.runtime.sendMessage({
    action: MessageActions.SAVE_HIGHLIGHT,
    highlight,
  });
}

export async function loadAndApplyStoredHighlights(): Promise<void> {
  try {
    const currentUrl = window.location.href;
    const highlights: Highlight[] = await browser.runtime.sendMessage({
      action: MessageActions.GET_HIGHLIGHTS_BY_URL,
      url: currentUrl,
    });

    if (highlights && highlights.length > 0) {
      console.log(`Found ${highlights.length} stored highlights for this page`);
      highlights.forEach((highlight) => {
        findAndHighlightText(highlight.text);
      });
    }
  } catch (error) {
    console.error("Failed to load and apply stored highlights:", error);
  }
}
