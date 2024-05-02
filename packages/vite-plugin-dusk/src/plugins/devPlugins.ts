import { readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import crypto from "crypto"

const runtimePublicPath = "/@dusk-games-sdk"

export function getDevPlugins(duskPkgPath: string): Plugin[] {
  return [
    {
      name: "vite:dusk-plugin:resolve-runtime",
      apply: "serve",
      enforce: "pre", // Run before Vite default resolve to avoid syscalls
      resolveId: (id) => (id === runtimePublicPath ? id : undefined),
      load: (id) =>
        id === runtimePublicPath
          ? readFileSync(
              path.resolve(duskPkgPath, "../multiplayer-dev.js"),
              "utf-8"
            )
          : undefined,
    },
    {
      name: "vite:dusk-plugin:inject-runtime",
      apply: "serve",
      enforce: "post",
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            // Inject a tag to differentiate between different games when running in dev mode
            {
              tag: "script",
              attrs: {
                "data-rune-allow-before-sdk": "1",
              },
              children: `window.__SDK_SETTINGS_ID__='${crypto
                .createHash("shake256", { outputLength: 8 })
                .update(process.cwd())
                .digest("hex")}'`,
              injectTo: "head-prepend",
            },
            // Inject the multiplayer script first of all.
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
