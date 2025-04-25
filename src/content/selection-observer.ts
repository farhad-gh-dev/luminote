import { showAddHighlightUI } from "./ui/popup-controller";

const POPUP_DELAY_MS = 10;

export function initSelectionObserver(): () => void {
  document.addEventListener("mouseup", handleMouseUp);

  return () => {
    document.removeEventListener("mouseup", handleMouseUp);
  };
}

function handleMouseUp(event: MouseEvent): void {
  // Capture mouse position when button is released
  const mousePosition = {
    x: event.pageX,
    y: event.pageY,
  };

  setTimeout(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      showAddHighlightUI(selection, mousePosition);
    }
  }, POPUP_DELAY_MS);
}
