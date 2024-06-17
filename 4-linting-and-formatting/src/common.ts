export interface Message {
  enabled?: boolean
}

export interface StoredConfig {
  enabled?: boolean
  item?: string
}

export interface TabResponse {
  title: string
  url: string
}

export function setBadgeText(enabled: boolean) {
  const text = enabled ? "ON" : "OFF"
  void chrome.action.setBadgeText({ text: text })
}
