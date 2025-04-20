// Background script for LumiNote extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("LumiNote extension installed");
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightSaved") {
    // Relay the message to the popup if it's open
    chrome.runtime.sendMessage({ action: "highlightSaved" });
  }
});
