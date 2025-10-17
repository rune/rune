import { readFileSync } from "node:fs"
import path from "node:path"
import type { HtmlTagDescriptor, Plugin } from "vite"
import crypto from "crypto"
import { parse, HTMLElement } from "node-html-parser"

const runtimePublicPath = "/@rune-sdk"

export function getDevPlugins(runePkgPath: string): Plugin[] {
  return [
    {
      name: "vite:rune-plugin:resolve-runtime",
      apply: "serve",
      enforce: "pre", // Run before Vite default resolve to avoid syscalls
      resolveId: (id) => (id === runtimePublicPath ? id : undefined),
      load: (id) =>
        id === runtimePublicPath
          ? readFileSync(
              path.resolve(runePkgPath, "../multiplayer-dev.js"),
              "utf-8"
            )
          : undefined,
    },
    {
      name: "vite:rune-plugin:inject-runtime",
      apply: "serve",
      enforce: "post",
      transformIndexHtml(html) {
        // Detect and extract application/json script tags from the head
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

        const tags: HtmlTagDescriptor[] = [
          {
            tag: "style",
            children: `html, body { background-color: #1c002b; }`,
            attrs: {
              id: "sdk-load-styles",
              "data-background-color": "1",
            },
            injectTo: "head-prepend",
          },

          // Inject a tag to differentiate between different games when running in dev mode
          {
            tag: "script",
            attrs: {
              id: "sdk-settings",
              "data-rune-allow-before-sdk": "1",
            },
            children: `window.__SDK_SETTINGS_ID__='${crypto
              .createHash("shake256", { outputLength: 8 })
              .update(process.cwd())
              .digest("hex")}'`,
            injectTo: "head-prepend",
          },
        ]

        // Insert JSON script tags as raw HTML before the last head-prepend script
        scripts.forEach((scriptTag) => {
          tags.push({
            tag: "script",
            children: scriptTag.innerHTML,
            attrs: { ...scriptTag.attributes },
            injectTo: "head-prepend",
          })
        })

        tags.push({
          tag: "script",
          attrs: {
            src: runtimePublicPath,
          },
          injectTo: "head-prepend",
        })

        return {
          html: modifiedHtml,
          tags,
        }
      },
    },
  ]
}
