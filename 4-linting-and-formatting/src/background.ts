import { Message, setBadgeText } from "./common"

function startUp() {
  chrome.storage.sync.get("enabled", (data) => {
    setBadgeText(!!data.enabled)
  })
}

// Ensure the background script always runs.
chrome.runtime.onStartup.addListener(startUp)
chrome.runtime.onInstalled.addListener(startUp)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const message = request as Message
  if (message.enabled !== undefined) {
    console.log(
      "Service worker received message from sender %s",
      sender.id,
      request,
    )
    sendResponse({ message: "Service worker processed the message" })
  }
})
