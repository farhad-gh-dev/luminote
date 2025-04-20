document.addEventListener("DOMContentLoaded", function () {
  // Get references to buttons
  const clearHighlightsBtn = document.getElementById("clearHighlights");
  const highlightsList = document.getElementById("highlightsList");

  // Load saved highlights
  loadHighlights();

  // Clear all highlights
  clearHighlightsBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "clearHighlights" });

      // Also clear from storage
      chrome.storage.local.set({ highlights: [] }, function () {
        loadHighlights(); // Refresh the list
      });
    });
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "highlightSaved") {
      loadHighlights(); // Refresh the list
    }
  });

  // Function to load saved highlights
  function loadHighlights() {
    chrome.storage.local.get({ highlights: [] }, function (data) {
      highlightsList.innerHTML = "";

      if (data.highlights.length === 0) {
        highlightsList.innerHTML = "<p>No highlights saved yet.</p>";
        return;
      }

      data.highlights.forEach(function (highlight, index) {
        const item = document.createElement("div");
        item.className = "highlight-item";

        const content = document.createElement("div");
        content.className = "highlight-content";
        content.textContent = highlight.text;

        const url = document.createElement("div");
        url.className = "highlight-url";
        url.textContent =
          highlight.url.substring(0, 40) +
          (highlight.url.length > 40 ? "..." : "");

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&times;";
        deleteBtn.title = "Delete highlight";
        deleteBtn.addEventListener("click", function () {
          deleteHighlight(index);
        });

        content.appendChild(url);
        item.appendChild(content);
        item.appendChild(deleteBtn);
        highlightsList.appendChild(item);
      });
    });
  }

  // Function to delete a highlight
  function deleteHighlight(index) {
    chrome.storage.local.get({ highlights: [] }, function (data) {
      data.highlights.splice(index, 1);
      chrome.storage.local.set({ highlights: data.highlights }, function () {
        loadHighlights(); // Refresh the list
      });
    });
  }
});
