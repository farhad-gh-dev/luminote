import tailwindStyles from "../styles/content.css?inline";

export function injectTailwindToShadowDom(shadowRoot: ShadowRoot): void {
  // Create a style element and inject the imported CSS
  const style = document.createElement("style");
  style.textContent = tailwindStyles;
  shadowRoot.appendChild(style);
}
