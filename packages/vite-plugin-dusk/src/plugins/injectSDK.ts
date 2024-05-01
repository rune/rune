import { readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import { createRequire } from "node:module"
import crypto from "crypto"

const runtimePublicPath = "/@dusk-games-sdk"

const require = createRequire(import.meta.url)

export function getInjectSdkPlugins(): Plugin[] {
  let duskPkgPath: string
  try {
    duskPkgPath = require.resolve("dusk-games-sdk/package.json")
  } catch (e) {
    throw new Error(
      "Cannot locate the dusk-games-sdk module. Did you install it?"
    )
  }

  const duskVersion = JSON.parse(readFileSync(duskPkgPath, "utf-8")).version

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
      enforce: "post",
      // Inject the multiplayer script first of all.
      // If we don't then live reload scripts will be injected before and
      // cause the dev UI to also reload when only the iframes should.
      transformIndexHtml(html, { server }) {
        return {
          html,
          tags: [
            //Only add id in dev mode
            ...(server
              ? [
                  {
                    tag: "script",
                    children: `window.__SDK_SETTINGS_ID__='${crypto
                      .createHash("shake256", { outputLength: 8 })
                      .update(process.cwd())
                      .digest("hex")}'`,
                    injectTo: "head-prepend" as const,
                  },
                ]
              : []),
            {
              tag: "script",
              attrs: {
                src: server
                  ? runtimePublicPath
                  : `https://cdn.jsdelivr.net/npm/dusk-games-sdk@${duskVersion}/multiplayer.js`,
              },
              injectTo: "head-prepend",
            },
          ],
        }
      },
    },
  ]
}
