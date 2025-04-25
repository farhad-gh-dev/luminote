import { createRoot } from "react-dom/client";
import AddHighlightUI from "@/features/content/add-highlight-ui";
import { injectTailwindToShadowDom } from "./tailwind-shadow-dom";

export function renderAddHighlightUI(
  selection: Selection,
  onHighlightClick: () => void,
  mousePosition: { x: number; y: number }
): { root: ShadowRoot; cleanup: () => void } {
  // Create container for Shadow DOM
  const container = document.createElement("div");
  container.id = "luminote-content-ui-container";
  container.style.position = "absolute";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const position = {
    x: mousePosition.x - 10,
    y: mousePosition.y - 40,
  };

  container.style.left = `${position.x}px`;
  container.style.top = `${position.y}px`;

  // Create shadow DOM
  const shadowRoot = container.attachShadow({ mode: "open" });

  const reactContainer = document.createElement("div");
  shadowRoot.appendChild(reactContainer);

  injectTailwindToShadowDom(shadowRoot);

  // Render React into shadow DOM
  const root = createRoot(reactContainer);
  root.render(
    <AddHighlightUI selection={selection} onHighlight={onHighlightClick} />
  );

  const cleanup = () => {
    root.unmount();
    container.remove();
  };

  return { root: shadowRoot, cleanup };
}
