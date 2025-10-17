import { parse, type HTMLElement } from "node-html-parser"
import { type HtmlTagDescriptor } from "vite"

export function extractJsonTags(html: string): {
  modifiedHtml: string
  jsonScripts: HtmlTagDescriptor[]
} {
  const parsedHtml = parse(html)
  const [head] = parsedHtml.getElementsByTagName("head")

  let modifiedHtml = html
  let scripts: HTMLElement[] = []
  if (head) {
    scripts = head.querySelectorAll("script[type='application/json']")

    if (scripts.length > 0) {
      for (const script of scripts) {
        script.remove()
      }
      modifiedHtml = parsedHtml.toString()
    }
  }

  return {
    modifiedHtml,
    jsonScripts: scripts.map((scriptTag) => ({
      tag: "script",
      children: scriptTag.innerHTML,
      attrs: { ...scriptTag.attributes },
      injectTo: "head-prepend",
    })),
  }
}
