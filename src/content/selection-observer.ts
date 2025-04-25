import { showContentUI } from "./popup-controller";

const POPUP_DELAY_MS = 10;

/** Initialize text selection and popup hide listeners */
export function initSelectionObserver(): void {
  document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseUp(): void {
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      showContentUI(selection);
    }
  }, POPUP_DELAY_MS);
}
