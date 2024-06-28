import { Message, StoredConfig, TabResponse } from "./common"

const blurFilter = "blur(6px)"
let textToBlur = ""

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
    if (node.textContent.includes(textToBlur)) {
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
let enabled = true
const keys = ["enabled", "item"]

chrome.storage.sync.get(keys, (data) => {
  const config = data as StoredConfig
  if (config.enabled === false) {
    enabled = false
  }
  if (config.item) {
    textToBlur = config.item
  }
  // Only start observing the DOM if the extension is enabled and there is text to blur.
  if (enabled) {
    observe()
  }
})

function observe() {
  if (textToBlur.trim().length > 0) {
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
    enabled = message.enabled
    if (enabled) {
      observe()
    } else {
      observer.disconnect()
    }
    const response: TabResponse = {
      title: document.title,
      url: window.location.href,
    }
    sendResponse(response)
  }
})
