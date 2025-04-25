// Utilities for handling text selection

import { v4 as uuidv4 } from "uuid";
import type { Highlight, SelectionInfo } from "@/types";

export function getSelectionInfo(): SelectionInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    return null;
  }

  const websiteTitle =
    document
      .querySelector('meta[property="og:site_name"]')
      ?.getAttribute("content") ||
    new URL(window.location.href).hostname.replace("www.", "");

  const iconLink =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');
  const faviconHref = iconLink ? iconLink.getAttribute("href") : "/favicon.ico";

  // Convert relative URL to absolute URL if needed
  const websiteIconUrl = new URL(faviconHref ?? "", window.location.origin)
    .href;

  return {
    text: selection.toString(),
    url: window.location.href,
    title: document.title,
    websiteTitle,
    websiteIconUrl,
  };
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
    websiteTitle: selectionInfo.websiteTitle,
    websiteIconUrl: selectionInfo.websiteIconUrl,
  };
}
