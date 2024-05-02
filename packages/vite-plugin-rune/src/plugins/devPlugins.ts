import { readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import crypto from "crypto"

const runtimePublicPath = "/@rune-games-sdk"

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
        return {
          html,
          tags: [
            // Inject a tag to differentiate between different games when running in dev mode
            {
              tag: "script",
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
