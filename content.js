// Global variables
let temporaryHighlights = [];
let highlightButton = null;
let deleteHighlightButton = null;
let currentClickedHighlight = null;

// Initialize highlighting functionality when the page loads
document.addEventListener("DOMContentLoaded", initializeHighlighter);
// Also initialize immediately in case the DOM is already loaded
initializeHighlighter();

function initializeHighlighter() {
  // Create the highlight button element that will appear when text is selected
  createHighlightButton();

  // Create delete button that will appear when a highlight is clicked
  createDeleteHighlightButton();

  // Add event listener for text selection
  document.addEventListener("mouseup", handleTextSelection);

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "saveHighlights") {
      saveHighlights();
    } else if (request.action === "clearHighlights") {
      clearHighlights();
    }
  });

  // Restore highlights when page loads after a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    restoreHighlightsOnPage();
  }, 500);
}

// Create the highlight button that appears when text is selected
function createHighlightButton() {
  highlightButton = document.createElement("div");
  highlightButton.className = "luminote-highlight-button";
  highlightButton.innerHTML = `
    <img src="${chrome.runtime.getURL(
      "images/icon16.png"
    )}" width="16px" height="16px" alt="Highlight" />
  `;
  highlightButton.style.position = "absolute";
  highlightButton.style.zIndex = "9999";
  highlightButton.style.cursor = "pointer";
  highlightButton.style.backgroundColor = "white";
  highlightButton.style.borderRadius = "50%";
  highlightButton.style.width = "28px";
  highlightButton.style.height = "28px";
  highlightButton.style.display = "flex";
  highlightButton.style.justifyContent = "center";
  highlightButton.style.alignItems = "center";
  highlightButton.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  highlightButton.style.transition = "transform 0.2s";
  highlightButton.style.display = "none";

  // When the button is clicked, highlight the selected text
  highlightButton.addEventListener("click", function () {
    createHighlight();
    hideHighlightButton();
  });

  // Button hover effect
  highlightButton.addEventListener("mouseover", function () {
    this.style.transform = "scale(1.1)";
  });

  highlightButton.addEventListener("mouseout", function () {
    this.style.transform = "scale(1)";
  });

  document.body.appendChild(highlightButton);
}

// Create the delete highlight button that appears when a saved highlight is clicked
function createDeleteHighlightButton() {
  deleteHighlightButton = document.createElement("div");
  deleteHighlightButton.className = "luminote-delete-button";
  deleteHighlightButton.innerHTML = `
    <span style="color: white;">×</span>
  `;
  deleteHighlightButton.style.position = "absolute";
  deleteHighlightButton.style.zIndex = "9999";
  deleteHighlightButton.style.cursor = "pointer";
  deleteHighlightButton.style.backgroundColor = "#e74c3c";
  deleteHighlightButton.style.borderRadius = "50%";
  deleteHighlightButton.style.width = "22px";
  deleteHighlightButton.style.height = "22px";
  deleteHighlightButton.style.display = "flex";
  deleteHighlightButton.style.justifyContent = "center";
  deleteHighlightButton.style.alignItems = "center";
  deleteHighlightButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  deleteHighlightButton.style.transition = "transform 0.2s";
  deleteHighlightButton.style.fontWeight = "bold";
  deleteHighlightButton.style.fontSize = "16px";
  deleteHighlightButton.style.display = "none";

  // When the button is clicked, delete the highlight
  deleteHighlightButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent event bubbling
    if (currentClickedHighlight) {
      deleteHighlightFromPage(currentClickedHighlight);
    }
    hideDeleteButton();
  });

  // Button hover effect
  deleteHighlightButton.addEventListener("mouseover", function () {
    this.style.transform = "scale(1.1)";
  });

  deleteHighlightButton.addEventListener("mouseout", function () {
    this.style.transform = "scale(1)";
  });

  document.body.appendChild(deleteHighlightButton);
}

// Function to handle text selection
function handleTextSelection(e) {
  const selection = window.getSelection();
  const selectionText = selection.toString().trim();

  if (selectionText !== "") {
    // Get the selection coordinates to position the highlight button
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Position the button at the end of the selection
    const buttonX = rect.right + window.scrollX;
    const buttonY = rect.top + window.scrollY - 30; // Position slightly above the selection

    // Show the highlight button
    highlightButton.style.left = `${buttonX}px`;
    highlightButton.style.top = `${buttonY}px`;
    highlightButton.style.display = "flex";

    // Add click event on document to hide button when clicking elsewhere
    setTimeout(() => {
      document.addEventListener("mousedown", hideHighlightButtonOnClickOutside);
    }, 10);
  } else {
    hideHighlightButton();
  }
}

// Hide the highlight button when clicking outside of it
function hideHighlightButtonOnClickOutside(e) {
  if (e.target !== highlightButton && !highlightButton.contains(e.target)) {
    hideHighlightButton();
    document.removeEventListener(
      "mousedown",
      hideHighlightButtonOnClickOutside
    );
  }
}

// Hide the highlight button
function hideHighlightButton() {
  if (highlightButton) {
    highlightButton.style.display = "none";
  }
}

// Hide the delete button when clicking outside of it
function hideDeleteButtonOnClickOutside(e) {
  if (
    e.target !== deleteHighlightButton &&
    !deleteHighlightButton.contains(e.target) &&
    (!currentClickedHighlight || e.target !== currentClickedHighlight.element)
  ) {
    hideDeleteButton();
    document.removeEventListener("mousedown", hideDeleteButtonOnClickOutside);
  }
}

// Hide the delete button
function hideDeleteButton() {
  if (deleteHighlightButton) {
    deleteHighlightButton.style.display = "none";
  }
  currentClickedHighlight = null;
}

// Function to create highlight from current selection
function createHighlight() {
  const selection = window.getSelection();
  const selectionText = selection.toString().trim();
  if (selectionText === "") return;

  try {
    // Create highlight
    const range = selection.getRangeAt(0);
    const highlightedSpan = document.createElement("span");
    highlightedSpan.className = "luminote-highlight";

    // Get information about the text node and its position for later restoration
    const textNodeInfo = getTextNodeInfo(range);

    range.surroundContents(highlightedSpan);

    // Add to temporary highlights
    temporaryHighlights.push({
      element: highlightedSpan,
      text: selectionText,
      timestamp: new Date().toISOString(),
    });

    // Auto-save the highlight with position information
    saveHighlightWithPosition(highlightedSpan, selectionText, textNodeInfo);

    // Clear selection
    selection.removeAllRanges();
  } catch (error) {
    console.error("Error creating highlight:", error);
    showNotification(
      "Couldn't highlight this selection. Try a simpler selection."
    );
  }
}

// Function to get information about the text node and its position
function getTextNodeInfo(range) {
  // Create a unique identifier for the text node
  const nodeInfo = {
    text: range.toString(),
    textBefore: "",
    textAfter: "",
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    xpath: getXPathForElement(range.startContainer),
  };

  // Get text before and after the selection in the same text node for context
  const startContainer = range.startContainer;

  // If we have a text node, get surrounding text for context
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const fullText = startContainer.textContent;
    // Get up to 50 chars before and after for context (helps with matching)
    const beforeStart = Math.max(0, range.startOffset - 50);
    const afterEnd = Math.min(fullText.length, range.endOffset + 50);

    nodeInfo.textBefore = fullText.substring(beforeStart, range.startOffset);
    nodeInfo.textAfter = fullText.substring(range.endOffset, afterEnd);
  }

  return nodeInfo;
}

// Function to get an XPath for an element
function getXPathForElement(element) {
  // If it's a text node, get XPath for its parent and then find this text node's index
  if (element.nodeType === Node.TEXT_NODE) {
    const parent = element.parentNode;
    let textNodeIndex = 0;
    let foundNode = false;

    // Count text nodes before this one
    for (let i = 0; i < parent.childNodes.length; i++) {
      const node = parent.childNodes[i];
      if (node === element) {
        foundNode = true;
        break;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        textNodeIndex++;
      }
    }

    return getXPathForElement(parent) + "/text()[" + (textNodeIndex + 1) + "]";
  }

  if (element === document.body) {
    return "/html/body";
  }

  // If element has an ID, we can use that for a shorter XPath
  if (element.id) {
    return "//*[@id='" + element.id + "']";
  }

  // Otherwise, get XPath based on parent and element position among siblings
  let currentNode = element;
  let path = "";

  while (currentNode && currentNode !== document.body) {
    let nodeName = currentNode.nodeName.toLowerCase();
    let siblings = Array.from(currentNode.parentNode.childNodes).filter(
      (node) => node.nodeName === currentNode.nodeName
    );

    if (siblings.length > 1) {
      // We need to specify which sibling
      const index = siblings.indexOf(currentNode) + 1;
      nodeName += "[" + index + "]";
    }

    path = "/" + nodeName + path;
    currentNode = currentNode.parentNode;
  }

  return "/html/body" + path;
}

// Function to save a single highlight
function saveHighlight(element, text) {
  chrome.storage.local.get({ highlights: [] }, function (data) {
    const currentHighlights = data.highlights;

    // Add new highlight
    currentHighlights.push({
      text: text,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
    });

    // Save back to storage
    chrome.storage.local.set({ highlights: currentHighlights }, function () {
      // Notify popup to refresh
      chrome.runtime.sendMessage({ action: "highlightSaved" });

      // Change color to indicate saved
      element.style.backgroundColor = "#a5d6a7"; // Light green

      showNotification("Highlight saved");
    });
  });
}

// Function to save a highlight with position information
function saveHighlightWithPosition(element, text, nodeInfo) {
  chrome.storage.local.get({ pageHighlights: {} }, function (data) {
    const currentUrl = window.location.href;
    const pageHighlights = data.pageHighlights || {};

    if (!pageHighlights[currentUrl]) {
      pageHighlights[currentUrl] = [];
    }

    // Add highlight with position information
    const highlightInfo = {
      text: text,
      timestamp: new Date().toISOString(),
      url: currentUrl,
      title: document.title,
      nodeInfo: nodeInfo,
    };

    pageHighlights[currentUrl].push(highlightInfo);

    // Save back to storage
    chrome.storage.local.set({ pageHighlights: pageHighlights }, function () {
      // Also save to the regular highlights collection for the popup display
      saveToHighlightsCollection(text);

      // Change color to indicate saved
      element.style.backgroundColor = "#a5d6a7"; // Light green

      showNotification("Highlight saved");
    });
  });
}

// Function to save to regular highlights collection (for popup display)
function saveToHighlightsCollection(text) {
  chrome.storage.local.get({ highlights: [] }, function (data) {
    const currentHighlights = data.highlights;

    // Add new highlight
    currentHighlights.push({
      text: text,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
    });

    // Save back to storage
    chrome.storage.local.set({ highlights: currentHighlights }, function () {
      // Notify popup to refresh
      chrome.runtime.sendMessage({ action: "highlightSaved" });
    });
  });
}

// Function to save all temporary highlights
function saveHighlights() {
  if (temporaryHighlights.length === 0) {
    showNotification("No highlights to save");
    return;
  }

  chrome.storage.local.get({ highlights: [] }, function (data) {
    const currentHighlights = data.highlights;

    // Add new highlights
    temporaryHighlights.forEach((highlight) => {
      currentHighlights.push({
        text: highlight.text,
        timestamp: highlight.timestamp,
        url: window.location.href,
        title: document.title,
      });
    });

    // Save back to storage
    chrome.storage.local.set({ highlights: currentHighlights }, function () {
      showNotification(`Saved ${temporaryHighlights.length} highlights`);

      // Notify popup to refresh
      chrome.runtime.sendMessage({ action: "highlightSaved" });

      // Change color to indicate saved
      temporaryHighlights.forEach((highlight) => {
        highlight.element.style.backgroundColor = "#a5d6a7"; // Light green
      });

      // Reset temporary array but keep highlights visible
      temporaryHighlights = [];
    });
  });
}

// Function to clear highlights
function clearHighlights() {
  const highlights = document.querySelectorAll(".luminote-highlight");

  highlights.forEach((el) => {
    // Replace the highlight element with its text content
    const textNode = document.createTextNode(el.textContent);
    el.parentNode.replaceChild(textNode, el);
  });

  temporaryHighlights = [];
  hideHighlightButton();

  // Also clear the stored highlights for this page
  const currentUrl = window.location.href;
  chrome.storage.local.get({ pageHighlights: {} }, function (data) {
    const pageHighlights = data.pageHighlights || {};
    if (pageHighlights[currentUrl]) {
      delete pageHighlights[currentUrl];
      chrome.storage.local.set({ pageHighlights: pageHighlights });
      console.log(`Cleared stored highlights for ${currentUrl}`);
    }
  });

  showNotification("Highlights cleared");
}

// Function to restore highlights on the current page
function restoreHighlightsOnPage() {
  const currentUrl = window.location.href;

  chrome.storage.local.get({ pageHighlights: {} }, function (data) {
    const pageHighlights = data.pageHighlights || {};
    const highlights = pageHighlights[currentUrl];

    if (!highlights || highlights.length === 0) {
      return; // No highlights to restore for this page
    }

    console.log(`Restoring ${highlights.length} highlights for ${currentUrl}`);

    // Try to apply each highlight
    highlights.forEach((highlight) => {
      try {
        applyHighlightFromInfo(highlight);
      } catch (error) {
        console.error("Error restoring highlight:", error);
      }
    });
  });
}

// Function to find an element by XPath
function getElementByXPath(xpath) {
  try {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  } catch (e) {
    console.error("Invalid XPath:", xpath, e);
    return null;
  }
}

// Function to apply a highlight from stored information
function applyHighlightFromInfo(highlight) {
  const nodeInfo = highlight.nodeInfo;
  if (!nodeInfo || !nodeInfo.xpath || !nodeInfo.text) return;

  try {
    // Try to find the text node using XPath
    const textNode = getElementByXPath(nodeInfo.xpath);

    if (!textNode) {
      console.log("Text node not found by XPath, trying text search");
      findAndHighlightTextInDocument(nodeInfo.text);
      return;
    }

    // If we found the text node, create a range for the stored text
    if (textNode.nodeType === Node.TEXT_NODE) {
      const content = textNode.textContent;

      // Find the position of our text in the node
      const context = (
        nodeInfo.textBefore +
        nodeInfo.text +
        nodeInfo.textAfter
      ).trim();
      let startPos;

      if (content.includes(context)) {
        // We have context - use it for more precise location
        startPos = content.indexOf(context) + nodeInfo.textBefore.length;
      } else if (content.includes(nodeInfo.text)) {
        // Fall back to just finding the text
        startPos = content.indexOf(nodeInfo.text);
      } else {
        // Text not found in this node
        return;
      }

      const range = document.createRange();
      range.setStart(textNode, startPos);
      range.setEnd(textNode, startPos + nodeInfo.text.length);

      // Create highlight span
      const highlightedSpan = document.createElement("span");
      highlightedSpan.className = "luminote-highlight saved";

      try {
        range.surroundContents(highlightedSpan);

        // Add click event to the highlight to show delete button
        highlightedSpan.addEventListener("click", function (e) {
          handleHighlightClick(e, highlightedSpan, highlight);
        });

        console.log("Successfully restored highlight:", nodeInfo.text);
      } catch (error) {
        console.error(
          "Error when surrounding content with highlight span:",
          error
        );
      }
    }
  } catch (error) {
    console.error("Error applying highlight:", error);
  }
}

// Function to handle when a highlight is clicked
function handleHighlightClick(e, highlightElement, highlight) {
  e.stopPropagation(); // Prevent the click from bubbling up

  // Set current clicked highlight
  currentClickedHighlight = {
    element: highlightElement,
    highlight: highlight,
  };

  // Get position of the highlight
  const rect = highlightElement.getBoundingClientRect();

  // Position delete button at the top-right of the highlight
  const buttonX = rect.right + window.scrollX - 5; // Adjust for better positioning
  const buttonY = rect.top + window.scrollY - 10;

  // Show the delete button
  deleteHighlightButton.style.left = `${buttonX}px`;
  deleteHighlightButton.style.top = `${buttonY}px`;
  deleteHighlightButton.style.display = "flex";

  // Add click event on document to hide button when clicking elsewhere
  setTimeout(() => {
    document.addEventListener("mousedown", hideDeleteButtonOnClickOutside);
  }, 10);
}

// Function to delete a specific highlight from the page
function deleteHighlightFromPage(highlightData) {
  if (!highlightData.element || !highlightData.highlight) return;

  // Replace the highlight element with its text content
  const textNode = document.createTextNode(highlightData.element.textContent);
  highlightData.element.parentNode.replaceChild(
    textNode,
    highlightData.element
  );

  // Remove the highlight from storage
  removeHighlightFromStorage(highlightData.highlight);

  showNotification("Highlight removed");
}

// Function to remove a highlight from storage
function removeHighlightFromStorage(highlight) {
  const currentUrl = window.location.href;

  // Remove from pageHighlights
  chrome.storage.local.get({ pageHighlights: {} }, function (data) {
    const pageHighlights = data.pageHighlights || {};

    if (pageHighlights[currentUrl] && pageHighlights[currentUrl].length > 0) {
      // Find the index of this highlight in the array
      const index = pageHighlights[currentUrl].findIndex(
        (h) => h.text === highlight.text && h.timestamp === highlight.timestamp
      );

      if (index !== -1) {
        // Remove this highlight
        pageHighlights[currentUrl].splice(index, 1);

        // If there are no more highlights for this page, remove the entry
        if (pageHighlights[currentUrl].length === 0) {
          delete pageHighlights[currentUrl];
        }

        // Save back to storage
        chrome.storage.local.set({ pageHighlights: pageHighlights });
      }
    }
  });

  // Also remove from the general highlights collection
  chrome.storage.local.get({ highlights: [] }, function (data) {
    const highlights = data.highlights;

    if (highlights && highlights.length > 0) {
      // Find the index of this highlight in the array
      const index = highlights.findIndex(
        (h) => h.text === highlight.text && h.url === currentUrl
      );

      if (index !== -1) {
        // Remove this highlight
        highlights.splice(index, 1);

        // Save back to storage
        chrome.storage.local.set({ highlights: highlights }, function () {
          // Notify popup to refresh
          chrome.runtime.sendMessage({ action: "highlightSaved" });
        });
      }
    }
  });
}

// Fallback function to find text anywhere in the document
function findAndHighlightTextInDocument(text) {
  // Use TreeWalker to iterate through all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    const content = node.textContent;
    if (content.includes(text)) {
      // Found the text, highlight it
      const startPos = content.indexOf(text);
      const range = document.createRange();
      range.setStart(node, startPos);
      range.setEnd(node, startPos + text.length);

      // Create highlight span
      const highlightedSpan = document.createElement("span");
      highlightedSpan.className = "luminote-highlight saved";

      try {
        range.surroundContents(highlightedSpan);

        // Add click event to the highlight
        highlightedSpan.addEventListener("click", function (e) {
          handleHighlightClick(e, highlightedSpan, {
            text: text,
            url: window.location.href,
          });
        });

        console.log("Successfully restored highlight using text search:", text);
        break; // Found and highlighted, stop searching
      } catch (error) {
        console.error(
          "Error when surrounding content with highlight span:",
          error
        );
      }
    }
  }
}

// Helper function to show notifications
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "rgba(74, 134, 232, 0.9)";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "9999";
  notification.style.fontFamily = "Arial, sans-serif";
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
