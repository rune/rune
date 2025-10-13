import fs from "fs/promises"
import globSync from "glob"
import { Box, Text } from "ink"
import { createRequire } from "module"
import React, { useEffect, useMemo, useState } from "react"
import { promisify } from "util"

import { Step } from "../components/Step.js"

const glob = promisify(globSync)
const require = createRequire(import.meta.url)

enum Steps {
  Ready,
  Extracting,
  Done,
  NoFilesExtracted,
  Failed,
}

const lngs = ["en", "es", "pt", "ru"]

export function ExtractTranslations({ args }: { args: string[] }) {
  const [step, setStep] = useState(Steps.Ready)
  const [error, setError] = useState<Error | null>(null)
  const targetDir = useMemo(() => args[0] || "public/translations", [args])

  useEffect(() => {
    if (step !== Steps.Ready || !targetDir) return
    setStep(Steps.Extracting)
    setError(null)

    const runExtractor = async () => {
      // i18next-scanner is a CommonJS-only module. In ESM contexts (like this file), we use Node's createRequire to load it.
      // This approach works in Node.js ESM environments, but may not work with ts-node/esm or other ESM loaders.
      // If you encounter issues running this code, ensure you are using Node.js directly (not ts-node/esm), or use a compatible loader.
      // For full ESM support, consider switching to a scanner library that provides ESM exports, or use a build step to extract translations.
      const { Parser } = require("i18next-scanner")

      const parser = new Parser({
        lngs,
        func: { list: ["Rune.t"] },
        sort: true,
        defaultValue: "",
        keySeparator: false,
        nsSeparator: false,
      })

      // Loop through all files in the root directory and any subdirectories, excluding .git and node_modules
      const files = await glob("**/*.{ts,tsx,js,jsx}", {
        ignore: ["**/node_modules/**", "**/.git/**"],
        nodir: true,
        dot: false,
      })

      for (const file of files) {
        try {
          const content = await fs.readFile(file, "utf-8")
          parser.parseFuncFromString(content, { list: ["Rune.t"] })
        } catch (error) {
          // Skip files that can't be read, but log for debugging
          console.warn(
            `Skipping file "${file}" due to read error: ${error instanceof Error ? error.message : error}`
          )
        }
      }

      // Get the extracted translations
      const translations = parser.get()
      let filesExtracted = false

      // Write translation files for each language
      for (const lng of lngs) {
        const translationData = translations[lng]
        if (
          translationData &&
          translationData.translation &&
          Object.keys(translationData.translation).length > 0
        ) {
          const outputPath = `${targetDir}/${lng}.json`
          // Load existing translations if the file exists
          let existingTranslations: Record<string, string> = {}
          try {
            const existingContent = await fs.readFile(outputPath, "utf-8")
            existingTranslations = JSON.parse(existingContent)
          } catch (error: any) {
            if (error.code === "ENOENT") {
              // File doesn't exist, that's okay
            } else {
              console.warn(
                `Warning: Could not read existing translation file "${outputPath}": ${error.message}`
              )
            }
          }

          // Merge translations: use existing values for keys that are already present,
          // and add new keys with empty values
          const mergedTranslations: Record<string, string> = {}
          const newKeys = translationData.translation as Record<string, string>

          for (const key of Object.keys(newKeys)) {
            // Preserve existing translation value if it exists, otherwise use empty string
            mergedTranslations[key] = existingTranslations[key] ?? ""
          }

          // Check if there are any changes (new keys or removed keys)
          const existingKeys = Object.keys(existingTranslations)
          const mergedKeys = Object.keys(mergedTranslations)
          const hasChanges =
            existingKeys.length !== mergedKeys.length ||
            existingKeys.some((key) => !mergedKeys.includes(key))
          // These two tests implicitly would also identify the case where mergedKeys has new keys not in existingKeys

          // Only write if there are changes
          if (hasChanges) {
            filesExtracted = true
            await fs.mkdir(targetDir, { recursive: true })
            await fs.writeFile(
              outputPath,
              JSON.stringify(mergedTranslations, null, 2)
            )
          }
        }
      }

      return filesExtracted
    }

    runExtractor()
      .then(async (filesExtracted) => {
        setStep(filesExtracted ? Steps.Done : Steps.NoFilesExtracted)
      })
      .catch((error) => {
        setStep(Steps.Failed)
        setError(error)
      })
  }, [step, targetDir])

  return (
    <Box flexDirection="column">
      <Step
        status="success"
        label={`Extracting translations to ${targetDir}`}
      />
      {step === Steps.Extracting && (
        <Step status="waiting" label="Extracting..." />
      )}
      {step === Steps.Done && (
        <Step status="success" label="Translations extracted!" />
      )}
      {step === Steps.NoFilesExtracted && (
        <Step status="success" label="No new translations found" />
      )}
      {step === Steps.Failed && (
        <Step
          status="error"
          label="Failed to extract translations"
          view={<Text>{error?.message}</Text>}
        />
      )}
    </Box>
  )
}
