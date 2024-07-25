import { Message, StoredConfig, TabResponse } from "./common"

export const blurFilter = "blur(6px)"
export let config: StoredConfig = {
  enabled: true,
  item: "",
  excludeHost: "",
}

// Search this DOM node for text to blur and blur the parent element if found.
function processNode(node: Node) {
  if (node.childNodes.length > 0) {
    Array.from(node.childNodes).forEach(processNode)
  }
  if (
    node.nodeType === Node.TEXT_NODE &&
    node.textContent !== null &&
    node.textContent.trim().length > 0
  ) {
    const parent = node.parentElement
    if (parent == null) {
      return
    }
    if (parent.tagName === "SCRIPT" || parent.style.filter === blurFilter) {
      // Already blurred
      return
    }
    if (node.textContent.includes(config.item ?? "")) {
      blurElement(parent)
    }
  }
}

function blurElement(elem: HTMLElement) {
  elem.style.filter = blurFilter
  console.debug(
    "blurred id:" +
      elem.id +
      " class:" +
      elem.className +
      " tag:" +
      elem.tagName +
      " text:" +
      (elem.textContent ?? ""),
  )
}

// Create a MutationObserver to watch for changes to the DOM.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(processNode)
    } else {
      processNode(mutation.target)
    }
  })
})

// Enable the content script by default.
chrome.storage.sync.get(null, (data) => {
  // Save the config to a global variable.
  config = data as StoredConfig
  // Only start observing the DOM if the extension is enabled and there is text to blur.
  if (
    config.enabled &&
    config.item &&
    config.excludeHost !== window.location.host
  ) {
    observe()
  }
})

export function observe() {
  if (config.item && config.item.trim().length > 0) {
    observer.observe(document, {
      attributes: false,
      characterData: true,
      childList: true,
      subtree: true,
    })
    // Loop through all elements on the page for initial processing.
    processNode(document)
  }
}

// Listen for messages from popup and service worker.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const message = request as Message
  if (message.enabled !== undefined) {
    console.log("Received message from sender %s", sender.id, request)
    config.enabled = message.enabled
    if (
      config.enabled &&
      config.item &&
      config.excludeHost !== window.location.host
    ) {
      observe()
    } else {
      observer.disconnect()
    }
  }
  if (message.excludeHost !== undefined) {
    console.log(
      "Received excludeHost message from sender %s",
      sender.id,
      request,
    )
    config.excludeHost = message.excludeHost
    if (config.excludeHost === window.location.host) {
      observer.disconnect()
    }
  }
  const response: TabResponse = {
    title: document.title,
    url: window.location.href,
  }
  sendResponse(response)
})
