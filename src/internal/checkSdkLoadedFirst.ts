export function checkSdkLoadedFirst() {
  const scripts = document.getElementsByTagName("script")

  if (scripts.length !== 1) {
    // eslint-disable-next-line no-console
    console.warn(
      "%c⚠️ Other scripts are imported before the Rune SDK script. Update " +
        "your index.html file so that the Rune SDK script tag is " +
        "included before any other scripts. It is also possible that this " +
        "warning is caused by a script injected by a browser extension or an " +
        "antivirus program. In that case  you can safely ignore this.",
      "font-size: 16px"
    )
  }
}
