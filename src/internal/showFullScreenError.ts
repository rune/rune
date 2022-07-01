const containerId = randomHtmlId()
const styleId = randomHtmlId()
const closeButtonClass = randomHtmlId()
const errorsClass = randomHtmlId()

const errors: string[] = []

export function showFullScreenError(error: string) {
  if (!errors.includes(error)) errors.push(error)
  setTimeout(render, 0)
}

function render() {
  const container =
    document.getElementById(containerId) ?? document.createElement("div")
  container.id = containerId
  document.body.appendChild(container)

  const style =
    document.getElementById(styleId) ?? document.createElement("style")
  style.id = styleId
  document.head.appendChild(style)

  style.innerHTML = css`
    #${containerId} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      background-color: black;
      opacity: 0.9;
      color: #f44336;
      font-family: Menlo, Consolas, monospace;
      font-size: ${size(1)};
      line-height: 1.5;
      padding: ${size(2.5)};
    }

    #${containerId} a {
      color: #fcc4c0;
    }

    #${containerId} a:hover {
      color: white;
    }

    #${containerId} .${closeButtonClass} {
      position: absolute;
      top: 0;
      right: 0;
      padding: 10px 20px;
      font-size: ${size(1.5)};
      color: white;
      font-family: sans-serif;
      cursor: pointer;
    }

    #${containerId} .${errorsClass} div:not(:first-child) {
      padding-top: ${size(2)};
    }
  `

  container.innerHTML = html`<div>
    <div class="${closeButtonClass}">X</div>
    <div class="${errorsClass}">
      ${errors.map((error) => `<div>${error}</div>`).join("")}
    </div>
  </div>`

  const closeButton = document.getElementsByClassName(closeButtonClass).item(0)

  closeButton?.addEventListener("click", () => container.remove())
}

function size(q: number) {
  return `min(${30 * q}pt, ${2 * q}vh)`
}

const css = emptyTemplateTag()
const html = emptyTemplateTag()

function emptyTemplateTag() {
  return (string: TemplateStringsArray, ...placeholders: any[]) =>
    string.reduce((acc, curr, i) => {
      acc += curr + (placeholders[i] || "")
      return acc
    }, "")
}

function randomHtmlId() {
  return `_${Math.round(Math.random() * 1e9)}`
}
