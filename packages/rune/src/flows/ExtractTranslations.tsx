import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import globSync from "glob"
import { Box, Text } from "ink"
import { createRequire } from "module"
import { parse, HTMLElement } from "node-html-parser"
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
const TRANSLATION_JSON_SCRIPT_ID = "rune-translation-data"

export function ExtractTranslations({ args }: { args: string[] }) {
  const [step, setStep] = useState(Steps.Ready)
  const [error, setError] = useState<Error | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
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
          const content = await readFile(file, "utf-8")
          parser.parseFuncFromString(content, { list: ["Rune.t"] })
        } catch (error) {
          // Skip files that can't be read, but log for debugging
        }
      }

      let indexHtmlPath = "paste-translations-into-index.html"
      if (existsSync("index.html")) {
        indexHtmlPath = "index.html"
      } else if (existsSync("public/index.html")) {
        indexHtmlPath = "public/index.html"
      } else if (existsSync("src/index.html")) {
        indexHtmlPath = "src/index.html"
      } else {
        setWarnings((prev) => [
          ...prev,
          `Could not find index.html in the project root, public/, or src/ directories. Please manually add the translation script tag written to ${indexHtmlPath} to the <head> of your HTML.`,
        ])
      }

      let existingTranslations: Record<string, Record<string, string>> = {}
      let parsedIndexHtml: HTMLElement
      let scriptTag: HTMLElement | undefined
      try {
        const indexHtmlContent = await readFile(indexHtmlPath, "utf-8")
        parsedIndexHtml = parse(indexHtmlContent)
      } catch (error) {
        parsedIndexHtml = parse("<html><head></head></html>")
        setWarnings((prev) => [
          ...prev,
          `Could not read or parse ${indexHtmlPath}. Please manually add the translation script tag written to ${indexHtmlPath} to the <head> of your HTML.`,
        ])
      }
      const scripts = parsedIndexHtml.getElementsByTagName("script")
      scriptTag = scripts.find(
        (script) =>
          script.getAttribute("id") === TRANSLATION_JSON_SCRIPT_ID &&
          script.getAttribute("type") === "application/json"
      )

      if (!scriptTag) {
        let [head] = parsedIndexHtml.getElementsByTagName("head")
        if (!head) {
          head = new HTMLElement("head", {}, "", parsedIndexHtml)
          // parsedIndexHtml.appendChild(head)
        }
        scriptTag = new HTMLElement(
          "script",
          {},
          `id="${TRANSLATION_JSON_SCRIPT_ID}" type="application/json" data-rune-allow-before-sdk="1"`,
          head
        )
        scriptTag.innerHTML = "{}"
        head.appendChild(scriptTag)
      }

      const translationJson = scriptTag?.text
      if (translationJson) {
        existingTranslations = JSON.parse(translationJson)
      }

      // Get the extracted translations
      const translations = parser.get()
      let translationsUpdated = false

      // Write translation files for each language
      const updatedTranslations: Record<string, Record<string, string>> = {}
      for (const lng of lngs) {
        const translationData = translations[lng]
        if (
          translationData &&
          translationData.translation &&
          Object.keys(translationData.translation).length > 0
        ) {
          // Load existing translations if the file exists
          const existing = existingTranslations[lng] || {}

          // Merge translations: use existing values for keys that are already present,
          // and add new keys with empty values
          const mergedTranslations: Record<string, string> = {}
          const newKeys = translationData.translation as Record<string, string>

          for (const key of Object.keys(newKeys)) {
            // Preserve existing translation value if it exists, otherwise use empty string
            mergedTranslations[key] = existing[key] ?? ""
          }

          // Check if there are any changes (new keys or removed keys)
          const existingKeys = Object.keys(existing)
          const mergedKeys = Object.keys(mergedTranslations)
          translationsUpdated =
            translationsUpdated ||
            existingKeys.length !== mergedKeys.length ||
            existingKeys.some((key) => !mergedKeys.includes(key))
          // These two tests implicitly would also identify the case where mergedKeys has new keys not in existingKeys

          updatedTranslations[lng] = mergedTranslations
        }
      }

      if (translationsUpdated && scriptTag) {
        scriptTag.innerHTML = JSON.stringify(updatedTranslations, null, 2)
        await writeFile(indexHtmlPath, parsedIndexHtml.toString(), "utf-8")
      }

      return translationsUpdated
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
      {warnings.map((warning) => (
        <Step
          key={warning}
          status="error"
          label="Warning"
          view={<Text>{warning}</Text>}
        />
      ))}
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
