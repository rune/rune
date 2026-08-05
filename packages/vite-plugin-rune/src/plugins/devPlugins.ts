import { readFileSync } from "node:fs"
import type { Plugin } from "vite"
import crypto from "crypto"
import { extractJsonTags } from "../lib/extractJsonTags.js"
import { resolveSdkAsset } from "../lib/resolveSdkAsset.js"

const runtimePublicPath = "/@rune-sdk"
const runtimeFileName = "multiplayer-dev.js"

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
              resolveSdkAsset(runePkgPath, runtimeFileName).absolutePath,
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
        const { modifiedHtml, jsonScripts: scripts } = extractJsonTags(html)

        return {
          html: modifiedHtml,
          tags: [
            {
              tag: "style",
              children: `html, body { background-color: #1c002b; }`,
              attrs: {
                id: "sdk-load-styles",
                "data-background-color": "1",
              },
              injectTo: "head-prepend",
            },
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
            ...scripts,
            {
              tag: "script",
              attrs: {
                src: runtimePublicPath,
              },
              injectTo: "head-prepend",
            },
          ],
        }
      },
    },
  ]
}
