export function setupConsole() {
  // Disable console logging in native app to reduce performance impact
  if (globalThis.ReactNativeWebView) {
    globalThis.console.log = function () {}
  }
}
