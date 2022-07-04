interface FullScreenError {
  header: string
  body: string
}

const errors: FullScreenError[] = []

export function showFullScreenError(
  error: FullScreenError,
  { replaceLinks }: { replaceLinks?: boolean } = {}
) {
  if (replaceLinks) {
    error.body = error.body.replace(
      /(https?:\/\/\S+)/gi,
      '<a target="_blank" href="$1">$1</a>'
    )
  }

  if (
    !errors.find(
      (existingError) =>
        existingError.header === error.header &&
        existingError.body === error.body
    )
  ) {
    errors.push(error)
  }

  setTimeout(render, 0)
}

function render() {
  const container =
    document.getElementById(uniqueId("container")) ??
    document.createElement("div")
  container.id = uniqueId("container")
  document.body.appendChild(container)

  const style =
    document.getElementById(uniqueId("style")) ??
    document.createElement("style")
  style.id = uniqueId("style")
  document.head.appendChild(style)

  style.innerHTML = css`
    #${uniqueId("container")} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      background-color: black;
      opacity: 0.9;
      color: #f44336;
      font-family: sans-serif;
      font-size: ${size(1)};
      line-height: 1.5;
      padding: ${size(2.5)};
    }

    #${uniqueId("container")} a {
      color: #fcc4c0;
    }

    #${uniqueId("container")} a:hover {
      color: white;
    }

    #${uniqueId("container")} pre {
      font-family: monospace;
      margin: 0;
      color: #fcc4c0;
      background-color: #222;
      display: inline-block;
      padding: ${size(0.2)} ${size(0.4)};
      border-radius: ${size(0.4)};
    }

    .${uniqueId("error")}:not(:first-child) {
      padding-top: ${size(2)};
    }

    .${uniqueId("error")} .${uniqueId("header")} {
      font-size: ${size(1.5)};
      padding: ${size(0.5)} 0;
    }

    .${uniqueId("error")} .${uniqueId("body")} > div:not(:first-child) {
      padding-top: ${size(0.4)};
    }

    .${uniqueId("errorsContainer")} {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `

  container.innerHTML = html`
    <div class="${uniqueId("errorsContainer")}">
      ${errors
        .map(
          (error) => html`<div class="${uniqueId("error")}">
            <div class="${uniqueId("header")}">${error.header}</div>
            <div class="${uniqueId("body")}">${error.body}</div>
          </div>`
        )
        .join("")}
    </div>
  `
}

function size(q: number) {
  return `min(${30 * q}pt, ${2 * q}vh)`
}

export const css = createSyntaxSupportTag()
export const html = createSyntaxSupportTag()

// This function returns an "empty" template tag that returns the string as-is,
// these tags are used to enable syntax highlighting in the IDE and code
// formatting with Prettier for embedded code
function createSyntaxSupportTag() {
  return (strings: TemplateStringsArray, ...expressions: any[]) =>
    strings.reduce((acc, curr, i) => acc + curr + (expressions[i] || ""), "")
}

const uniqueIds: { [key: string]: string } = {}

function uniqueId(id: string) {
  if (!uniqueIds[id]) uniqueIds[id] = `_${Math.round(Math.random() * 1e9)}`
  return uniqueIds[id]
}
