// Utilities for handling highlights

import browser from "webextension-polyfill";
import { v4 as uuidv4 } from "uuid";
import { MessageActions } from "@/constants/message-actions";
import type { Highlight, SelectionInfo } from "@/types";

export function getSelectionInfo(): SelectionInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    return null;
  }

  return {
    text: selection.toString(),
    url: window.location.href,
    title: document.title,
  };
}

export function applyHighlightStyling(selection: Selection): void {
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const highlightSpan = document.createElement("span");
  highlightSpan.className = "luminote-highlighted-text";

  try {
    range.surroundContents(highlightSpan);
    selection.removeAllRanges();
  } catch (error) {
    console.error("Failed to apply highlight styling:", error);
  }
}

export function createHighlightFromSelection(
  selectionInfo: SelectionInfo
): Highlight {
  return {
    id: uuidv4(),
    text: selectionInfo.text,
    url: selectionInfo.url,
    title: selectionInfo.title,
    createdAt: new Date().toISOString(),
  };
}

export function saveHighlightToStorage(highlight: Highlight): Promise<void> {
  return browser.runtime.sendMessage({
    action: MessageActions.SAVE_HIGHLIGHT,
    highlight,
  });
}
