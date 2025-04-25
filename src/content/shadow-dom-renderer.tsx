import { createRoot } from "react-dom/client";
import ContentUI from "@/features/content/content-ui";
import { injectTailwindToShadowDom } from "./tailwind-shadow-dom";

/**
 * Creates a shadow DOM container and renders React into it
 */
export function renderContentUI(
  selection: Selection,
  onHighlightClick: () => void
): { root: ShadowRoot; cleanup: () => void } {
  // Create container for Shadow DOM
  const container = document.createElement("div");
  container.id = "luminote-content-ui-container";
  container.style.position = "absolute";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  // Get position from selection
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const position = {
    x: rect.right + window.scrollX,
    y: rect.top + window.scrollY - 30,
  };

  // Position the container
  container.style.left = `${position.x}px`;
  container.style.top = `${position.y}px`;

  // Create shadow DOM
  const shadowRoot = container.attachShadow({ mode: "open" });

  // Create container for React
  const reactContainer = document.createElement("div");
  shadowRoot.appendChild(reactContainer);

  // Inject Tailwind CSS into shadow DOM
  injectTailwindToShadowDom(shadowRoot);

  // Add any additional custom styles needed for specific components
  const style = document.createElement("style");
  style.textContent = `
    /* Any additional custom styles that can't be handled by Tailwind */
    .luminote-content-ui-root {
      min-width: 120px;
    }
  `;
  shadowRoot.appendChild(style);

  // Render React into shadow DOM
  const root = createRoot(reactContainer);
  root.render(
    <ContentUI selection={selection} onHighlight={onHighlightClick} />
  );

  // Return cleanup function
  const cleanup = () => {
    root.unmount();
    container.remove();
  };

  return { root: shadowRoot, cleanup };
}
