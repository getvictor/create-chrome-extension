import { Message, StoredConfig } from "./common"
import "./options.css"

chrome.storage.sync.get(null, (data) => {
  const config = data as StoredConfig
  const excludeHost = config.excludeHost ?? ""
  const input = document.getElementById(`exclude_host`) as HTMLInputElement
  input.value = excludeHost
  input.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
      const updatedExcludeWebsite = event.target.value
      const updatedConfig: StoredConfig = { excludeHost: updatedExcludeWebsite }
      void chrome.storage.sync.set(updatedConfig)
      // Send message to content script in all tabs
      void chrome.tabs
        .query({})
        .then((tabs) => {
          const message: Message = { excludeHost: updatedExcludeWebsite }
          for (const tab of tabs) {
            if (tab.id !== undefined) {
              chrome.tabs.sendMessage(tab.id, message).catch(() => {
                // We ignore tabs without a proper URL, like chrome://extensions/
                // Do nothing
              })
            }
          }
        })
        .catch((error: unknown) => {
          console.error("Could not query tabs", error)
        })
    }
  })
})
