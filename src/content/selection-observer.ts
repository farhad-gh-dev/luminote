import {
  showHighlightPopup,
  removeHighlightPopup,
  popupContainsElement,
  isPopupActive,
} from "./ui-components";
import { handleSaveHighlight } from "./popup-controller";

const POPUP_DELAY_MS = 10;

/** Initialize text selection and popup hide listeners */
export function initSelectionObserver(): void {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousedown", handleMouseDown);
}

function handleMouseUp(event: MouseEvent): void {
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      showHighlightPopup(selection, handleSaveHighlight);
    } else if (!popupContainsElement(event.target as Node)) {
      removeHighlightPopup();
    }
  }, POPUP_DELAY_MS);
}

function handleMouseDown(event: MouseEvent): void {
  if (isPopupActive() && !popupContainsElement(event.target as Node)) {
    removeHighlightPopup();
  }
}
