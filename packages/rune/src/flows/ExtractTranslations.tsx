import fs from "fs/promises"
import globSync from "glob"
import { createRequire } from "module"
import { promisify } from "util"
import { Box, Text } from "ink"
import React, { useEffect, useMemo, useState } from "react"

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
      // Use require to load CommonJS module - dynamic import doesn't work with ts-node/esm
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
          // Skip files that can't be read
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
          filesExtracted = true
          const outputPath = `${targetDir}/${lng}.json`
          await fs.mkdir(targetDir, { recursive: true })
          // TODO: if the file already exists, pull in any keys from translationData.translation
          // that are already present and add them.
          // THe intent is to avoid overwriting the existing translations, but also to remove any
          // keys that are no longer used (i.e.,  not present in translationData.translation)
          // ALso, if it turns out all the keys are already present, we should skip writing the file
          // and not set filesExtracted to true.
          await fs.writeFile(
            outputPath,
            JSON.stringify(translationData.translation, null, 2)
          )
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
