export function setBadgeText(enabled: boolean) {
    const text = enabled ? "ON" : "OFF"
    void chrome.action.setBadgeText({text: text})
}
