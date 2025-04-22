let popup: HTMLDivElement | null = null;
let isActive = false;
let currentSelection: Selection | null = null;

export function showHighlightPopup(
  selection: Selection,
  onHighlightClick: () => void
): void {
  // Remove any existing popup
  removeHighlightPopup();

  if (!selection || selection.toString().trim() === "") {
    return;
  }

  currentSelection = selection;

  // Get the range and its bounding rectangle
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Create the popup element
  popup = document.createElement("div");
  popup.id = "luminote-highlight-popup";
  popup.className = "luminote-highlight-popup";
  popup.style.left = `${rect.right + window.scrollX}px`;
  popup.style.top = `${rect.top + window.scrollY - 30}px`;

  // Create the highlight button
  const highlightButton = document.createElement("button");
  highlightButton.textContent = "Highlight";
  highlightButton.className = "luminote-highlight-button";
  highlightButton.addEventListener("click", onHighlightClick);

  popup.appendChild(highlightButton);
  document.body.appendChild(popup);

  isActive = true;
}

export function removeHighlightPopup(): void {
  if (popup) {
    popup.remove();
    popup = null;
    isActive = false;
  }
}

export function popupContainsElement(element: Node | null): boolean {
  if (!popup || !element) return false;
  return popup.contains(element);
}

export function isPopupActive(): boolean {
  return isActive;
}

export function getCurrentSelection(): Selection | null {
  return currentSelection;
}

export function injectStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .luminote-highlighted-text {
      background-color: rgba(99, 102, 241, 0.3);
      border-radius: 2px;
    }
    
    .luminote-highlight-popup {
      position: absolute;
      z-index: 9999;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 0px;
    }
    
    .luminote-highlight-button {
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}
