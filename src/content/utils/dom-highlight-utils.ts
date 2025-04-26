// Utilities for DOM manipulation related to highlighting

export function applyHighlightStyling(selection: Selection): void {
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const highlightSpan = document.createElement("mark");
  highlightSpan.className = "luminote-highlighted-text";

  try {
    range.surroundContents(highlightSpan);
    selection.removeAllRanges();
  } catch (error) {
    console.error("Failed to apply highlight styling:", error);
  }
}

export function injectStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .luminote-highlighted-text {
      background-color: rgba(99, 102, 241, 0.3);
      border-radius: 2px;
    }
  `;
  document.head.appendChild(style);
}

export function findAndHighlightText(text: string): void {
  if (!text || text.trim().length === 0) return;

  const textToFind = text.trim();
  const textNodes: Text[] = [];

  // Find all text nodes in the document
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        // Skip script and style elements
        const parentElement = node.parentElement;
        if (
          parentElement &&
          (parentElement.tagName === "SCRIPT" ||
            parentElement.tagName === "STYLE" ||
            parentElement.tagName === "NOSCRIPT" ||
            // Skip already highlighted elements
            parentElement.classList.contains("luminote-highlighted-text"))
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode as Text;
    if (node.textContent && node.textContent.includes(textToFind)) {
      textNodes.push(node);
    }
  }

  // Apply highlighting to found text nodes
  textNodes.forEach((textNode) => {
    highlightTextInNode(textNode, textToFind);
  });
}

function highlightTextInNode(node: Text, textToHighlight: string): void {
  const nodeContent = node.textContent || "";
  const startIndex = nodeContent.indexOf(textToHighlight);

  if (startIndex === -1) return;

  // Split the text node at the start of the match
  const range = document.createRange();
  range.setStart(node, startIndex);
  range.setEnd(node, startIndex + textToHighlight.length);

  // Create a highlight element and replace the range with it
  const highlightSpan = document.createElement("mark");
  highlightSpan.className = "luminote-highlighted-text";
  highlightSpan.textContent = textToHighlight;

  try {
    range.deleteContents();
    range.insertNode(highlightSpan);
  } catch (error) {
    console.error("Failed to highlight text node:", error);
  }
}

export function removeHighlightFromDOM(text: string): void {
  if (!text || text.trim().length === 0) return;

  const textToFind = text.trim();
  const highlightElements = document.querySelectorAll(
    ".luminote-highlighted-text"
  );

  highlightElements.forEach((element) => {
    if (element.textContent === textToFind) {
      // Replace the highlighted element with just its text content
      const textNode = document.createTextNode(element.textContent);
      element.parentNode?.replaceChild(textNode, element);
    }
  });
}
