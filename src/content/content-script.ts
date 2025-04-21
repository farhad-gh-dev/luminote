import { v4 as uuidv4 } from "uuid";

interface Highlight {
  id: string;
  text: string;
  url: string;
  title: string;
  createdAt: string;
  tags?: string[];
}

// State to track if the highlight popup is currently shown
let isHighlightPopupActive = false;
let highlightPopup: HTMLDivElement | null = null;
let currentSelection: Selection | null = null;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getSelectionInfo") {
    const info = getSelectionInfo();
    sendResponse(info);
  }
});

// Create a floating button that appears when text is selected
function createHighlightButton() {
  // Remove any existing button
  removeHighlightButton();

  // Get the current selection
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    return;
  }

  currentSelection = selection;

  // Get the range and its bounding rectangle
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Create the popup element
  highlightPopup = document.createElement("div");
  highlightPopup.id = "luminote-highlight-popup";
  highlightPopup.style.position = "absolute";
  highlightPopup.style.left = `${rect.right + window.scrollX}px`;
  highlightPopup.style.top = `${rect.top + window.scrollY - 30}px`;
  highlightPopup.style.zIndex = "9999";
  highlightPopup.style.background = "#ffffff";
  highlightPopup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  highlightPopup.style.borderRadius = "4px";
  highlightPopup.style.padding = "4px";

  // Create the highlight button
  const highlightButton = document.createElement("button");
  highlightButton.textContent = "Highlight";
  highlightButton.style.background = "#6366f1"; // Indigo color
  highlightButton.style.color = "white";
  highlightButton.style.border = "none";
  highlightButton.style.borderRadius = "4px";
  highlightButton.style.padding = "4px 8px";
  highlightButton.style.cursor = "pointer";
  highlightButton.style.fontSize = "14px";
  highlightButton.addEventListener("click", saveHighlight);

  highlightPopup.appendChild(highlightButton);
  document.body.appendChild(highlightPopup);

  isHighlightPopupActive = true;
}

// Remove the highlight button
function removeHighlightButton() {
  const existingPopup = document.getElementById("luminote-highlight-popup");
  if (existingPopup) {
    existingPopup.remove();
  }
  isHighlightPopupActive = false;
  highlightPopup = null;
}

// Get information about the current selection
function getSelectionInfo() {
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

// Save the highlight
function saveHighlight() {
  if (!currentSelection) return;

  const selectionInfo = getSelectionInfo();
  if (!selectionInfo) return;

  // Create a new highlight object
  const highlight: Highlight = {
    id: uuidv4(),
    text: selectionInfo.text,
    url: selectionInfo.url,
    title: selectionInfo.title,
    createdAt: new Date().toISOString(),
  };

  // Visually highlight the text in the webpage
  applyHighlightStyling(currentSelection);

  // Send the highlight to background script for storage
  chrome.runtime.sendMessage({
    action: "saveHighlight",
    highlight,
  });

  // Remove the popup
  removeHighlightButton();
}

// Apply visual highlighting to the selected text
function applyHighlightStyling(selection: Selection) {
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const highlightSpan = document.createElement("span");
  highlightSpan.className = "luminote-highlighted-text";
  highlightSpan.style.backgroundColor = "rgba(99, 102, 241, 0.3)"; // Light indigo
  highlightSpan.style.borderRadius = "2px";

  range.surroundContents(highlightSpan);
  selection.removeAllRanges();
}

// Listen for text selections
document.addEventListener("mouseup", (event) => {
  // Small delay to ensure selection is complete
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      createHighlightButton();
    } else if (!isElementInPopup(event.target as Node)) {
      removeHighlightButton();
    }
  }, 10);
});

// Check if the given element is inside our popup
function isElementInPopup(element: Node | null): boolean {
  if (!highlightPopup || !element) return false;
  return highlightPopup.contains(element);
}

// Click outside to dismiss
document.addEventListener("mousedown", (event) => {
  if (isHighlightPopupActive && !isElementInPopup(event.target as Node)) {
    removeHighlightButton();
  }
});

// Add necessary styling
const style = document.createElement("style");
style.textContent = `
  .luminote-highlighted-text {
    background-color: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }
`;
document.head.appendChild(style);

console.log("Luminote content script loaded");
