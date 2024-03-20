import { readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import { createRequire } from "node:module"

const runtimePublicPath = "/@rune-games-sdk"

const require = createRequire(import.meta.url)

export function getInjectSdkPlugins(): Plugin[] {
  let runePkgPath: string
  try {
    runePkgPath = require.resolve("rune-games-sdk/package.json")
  } catch (e) {
    throw new Error(
      "Cannot locate the rune-games-sdk module. Did you install it?"
    )
  }

  const runeVersion = JSON.parse(readFileSync(runePkgPath, "utf-8")).version

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
      enforce: "post",
      // Inject the multiplayer script first of all.
      // If we don't then live reload scripts will be injected before and
      // cause the dev UI to also reload when only the iframes should.
      transformIndexHtml(html, { server }) {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                src: server
                  ? runtimePublicPath
                  : `https://cdn.jsdelivr.net/npm/rune-games-sdk@${runeVersion}/multiplayer.js`,
              },
              injectTo: "head-prepend",
            },
          ],
        }
      },
    },
  ]
}
