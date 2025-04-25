/**
 * Get the processed Tailwind CSS at runtime
 * This works because Vite will bundle and process the CSS with Tailwind
 * during build time
 */
export function getProcessedTailwindCss(): string {
  // Find all style elements on the page that might contain processed Tailwind CSS
  const styleElements = Array.from(document.querySelectorAll("style"));

  // Look for the one that contains Tailwind-specific utilities
  for (const style of styleElements) {
    // Look for telltale signs of Tailwind classes in the processed CSS
    if (
      style.textContent &&
      (style.textContent.includes(".bg-indigo-") ||
        style.textContent.includes(".text-") ||
        style.textContent.includes(".flex") ||
        style.textContent.includes(".shadow-"))
    ) {
      return style.textContent;
    }
  }

  return ""; // Return empty string if not found
}

export function injectTailwindToShadowDom(shadowRoot: ShadowRoot): void {
  const tailwindCss = getProcessedTailwindCss();

  if (!tailwindCss) {
    console.warn(
      "Could not find processed Tailwind CSS to inject into Shadow DOM"
    );
    return;
  }

  // Create a style element and inject the Tailwind CSS
  const style = document.createElement("style");
  style.textContent = tailwindCss;
  shadowRoot.appendChild(style);
}
