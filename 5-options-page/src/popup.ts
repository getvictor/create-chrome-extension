import { Message, setBadgeText, StoredConfig, TabResponse } from "./common"

console.log("Hello, world from popup!")

// Handle the ON/OFF switch
const checkbox = document.getElementById("enabled") as HTMLInputElement
chrome.storage.sync.get("enabled", (data) => {
  const config = data as StoredConfig
  checkbox.checked = !!config.enabled
  setBadgeText(!!config.enabled)
})
checkbox.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    void chrome.storage.sync.set({ enabled: event.target.checked })
    setBadgeText(event.target.checked)
    // Send message to content script in all tabs
    const message: Message = { enabled: event.target.checked }
    chrome.tabs
      .query({})
      .then((tabs) => {
        for (const tab of tabs) {
          if (tab.id === undefined) {
            continue
          }
          // Note: tab properties such as tab.title or tab.url can only be accessed for
          // URLs in the host_permissions section of manifest.json
          chrome.tabs
            .sendMessage(tab.id, message)
            .then((response) => {
              const tabResponse = response as TabResponse
              console.info(
                "Popup received response from tab with title '%s' and url %s",
                tabResponse.title,
                tabResponse.url,
              )
            })
            .catch((error: unknown) => {
              console.warn(
                "Popup could not send message to tab %d",
                tab.id,
                error,
              )
            })
        }
      })
      .catch((error: unknown) => {
        console.warn("Popup could not query tabs", error)
      })
    chrome.runtime
      .sendMessage(message)
      .then((response) => {
        console.info("Popup received response", response)
      })
      .catch((error: unknown) => {
        console.warn("Popup could not send message", error)
      })
  }
})

// Handle the input field
const input = document.getElementById("item") as HTMLInputElement
chrome.storage.sync.get("item", (data) => {
  const config = data as StoredConfig
  input.value = config.item ?? ""
})
input.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    void chrome.storage.sync.set({ item: event.target.value })
  }
})
