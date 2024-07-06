export interface Message {
  enabled?: boolean
  excludeHost?: string
}

export interface StoredConfig {
  enabled?: boolean
  item?: string
  excludeHost?: string
}

export interface TabResponse {
  title: string
  url: string
}

export function setBadgeText(enabled: boolean) {
  const text = enabled ? "ON" : "OFF"
  void chrome.action.setBadgeText({ text: text })
}
