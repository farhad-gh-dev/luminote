import { Message } from "../types";

/** Checks if running in a Chrome extension environment */
export function isExtensionEnvironment(): boolean {
  return (
    typeof chrome !== "undefined" &&
    !!chrome.runtime &&
    !!chrome.runtime.sendMessage &&
    !!chrome.tabs
  );
}

/** Sends a message via chrome.runtime.sendMessage */
export function runtimeSendMessage<T = unknown>(message: Message): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!isExtensionEnvironment() || !chrome.runtime?.sendMessage) {
      reject(new Error("Runtime messaging is not available"));
      return;
    }
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response as T);
      }
    });
  });
}

/** Sends a message to a specific tab via chrome.tabs.sendMessage */
export function tabSendMessage<T = unknown>(
  tabId: number,
  message: Message
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!isExtensionEnvironment() || !chrome.tabs?.sendMessage) {
      reject(new Error("Tab messaging is not available"));
      return;
    }
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        // Check lastError as tabs.sendMessage uses it too
        reject(chrome.runtime.lastError);
      } else {
        resolve(response as T);
      }
    });
  });
}

/** Registers a listener for incoming messages */
export function onMessage(
  listener: (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => void
): void {
  chrome.runtime.onMessage.addListener(listener);
}

/** Retrieves items from chrome.storage.sync */
export function storageGet<T = unknown>(keys: string | string[]): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!isExtensionEnvironment() || !chrome.storage?.sync) {
      reject(new Error("Not in extension environment"));
      return;
    }
    chrome.storage.sync.get(keys, (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items as T);
      }
    });
  });
}

/** Sets items in chrome.storage.sync */
export function storageSet(items: object): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isExtensionEnvironment() || !chrome.storage?.sync) {
      reject(new Error("Not in extension environment"));
      return;
    }
    chrome.storage.sync.set(items, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
