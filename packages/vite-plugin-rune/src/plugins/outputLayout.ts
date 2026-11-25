import type { Plugin } from "vite"

// Rune serves only binary files from /assets/, so code chunks and CSS go
// to the root instead of Vite's default assets/ folder.
export function getOutputLayoutPlugin(): Plugin[] {
  return [
    {
      name: "vite:rune-plugin:output-layout",
      apply: "build",
      config: (config) => {
        const output = config.build?.rollupOptions?.output
        if (Array.isArray(output)) return

        return {
          build: {
            rollupOptions: {
              output: {
                chunkFileNames: output?.chunkFileNames ?? "[name]-[hash].js",
                assetFileNames:
                  output?.assetFileNames ??
                  ((asset) =>
                    (asset.name ?? "").endsWith(".css")
                      ? "[name]-[hash][extname]"
                      : "assets/[name]-[hash][extname]"),
              },
            },
          },
        }
      },
    },
  ]
}
