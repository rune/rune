import { Worker } from "okie"
import type { Plugin } from "vite"
import type { MinifyOptions, MinifyOutput } from "terser"

//Vite does not allow to disable minification for a specific file.
//This plugin in turn disables minifation on all files, and then runs it on all files except logic.js
//Implemented using https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/terser.ts as inspiration
//And adapted according to https://rollupjs.org/plugin-development/#output-generation-hooks chart, so that this plugin runs after esbuild is done.
export function terserPlugin(minifyLogic: boolean): Plugin {
  const makeWorker = () =>
    new Worker(
      async (code: string, options: MinifyOptions) => {
        const terser = await import("terser")
        return terser.minify(code, options) as MinifyOutput
      },
      {
        max: undefined,
      }
    )

  let worker: ReturnType<typeof makeWorker>

  let shouldMinify = true

  return {
    name: "vite:dusk-plugin:minify",
    apply: "build",
    //Disable minification for all files
    config: (config) => {
      //In case user manually disables minification, we'll skip running it for all files too.
      if (config.build?.minify === false) {
        shouldMinify = false
      }

      return {
        ...config,
        build: {
          minify: false,
        },
      }
    },
    async generateBundle(outputOptions, bundle) {
      worker || (worker = makeWorker())

      await Promise.all(
        Object.keys(bundle).map(async (name) => {
          if (!shouldMinify || (name === "logic.js" && !minifyLogic)) {
            return
          }

          const chunk = bundle[name]

          if ("code" in chunk) {
            const res = await worker.run(chunk.code, {
              module: outputOptions.format.startsWith("es"),
              toplevel: outputOptions.format === "cjs",
            })

            chunk.code = res.code || ""
          }
        })
      )
    },

    closeBundle() {
      worker?.stop()
    },
  }
}
