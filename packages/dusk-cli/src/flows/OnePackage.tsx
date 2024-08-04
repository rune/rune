import { exec, spawn } from "child_process"
import { Box, Text } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import React, { useCallback, useState } from "react"
import * as url from "url"

import { Select } from "../components/Select.js"
import { Step } from "../components/Step.js"
import transformJSON from "../lib/jscodeshift/onePackage/PackageTransform.js"

enum Steps {
  Target,
  IncorrectDir,
  Type,
  Prettier,
  PackageJSON,
  Vite,
  Eslint,
  Install,
  InstallError,
  Finish,
}

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"

const templates = [
  { label: "JavaScript", value: "javascript" },
  { label: "JavaScript + React", value: "javascript-react" },
  { label: "TypeScript", value: "typescript" },
  { label: "TypeScript + React", value: "typescript-react" },
  { label: "TypeScript + Svelte", value: "typescript-svelte" },
]

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "")
}

const PLACEHOLDER = process.cwd()

const require = createRequire(import.meta.url)

export function OnePackage() {
  const [step, setStep] = useState(Steps.Target)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    "javascript"
  )

  const [prettier, setPrettier] = React.useState<string | null>("no")

  const [enteredTargetDir, setTargetDir] = useState(PLACEHOLDER)

  const onSubmitTarget = useCallback(async (value: string) => {
    const targetDir = formatTargetDir(value || PLACEHOLDER)
    setTargetDir(targetDir)
    setStep(Steps.Type)
  }, [])

  const onSubmitPrettier = useCallback(async () => {
    const type = selectedTemplate
    const packageJsonPath = path.join(enteredTargetDir, "package.json")

    if (!fs.existsSync(packageJsonPath)) {
      setStep(Steps.IncorrectDir)
    }

    const packageJson = transformJSON(
      require(packageJsonPath),
      type as any,
      prettier === "yes"
    )

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

    async function transform(
      stepToUse: Steps,
      transformName: string,
      targets: string[]
    ) {
      setStep(stepToUse)

      const transformPath = path.resolve(
        __dirname,
        `../../cjs/lib/jscodeshift/onePackage/${transformName}.js`
      )

      const process = exec(
        `npx jscodeshift --parser=ts -t ${transformPath} ${targets.join(" ")}`
      )

      const promise = new Promise<void>((resolve) => {
        process.on("close", () => {
          resolve()
        })
      })

      await promise
    }

    await transform(Steps.Vite, "ViteTransform", [
      path.join(enteredTargetDir, "vite.config.ts"),
      path.join(enteredTargetDir, "vite.config.js"),
    ])

    setStep(Steps.Eslint)

    if (prettier === "yes") {
      const prettierConfig = fs.readFileSync(
        path.resolve(__dirname, `../../templates/${type}/.prettierrc.cjs`)
      )

      fs.writeFileSync(
        path.join(enteredTargetDir, ".prettierrc.cjs"),
        prettierConfig
      )
    }

    ;[".eslintignore", ".eslintrc.js", ".eslintrc.cjs"].forEach((file) => {
      const fullPath = path.join(enteredTargetDir, file)
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath)
      }
    })

    let eslintConfig = fs
      .readFileSync(
        path.resolve(__dirname, `../../templates/${type}/eslint.config.mjs`)
      )
      .toString()

    if (prettier !== "yes") {
      eslintConfig = eslintConfig
        .replace(
          'import prettier from "eslint-plugin-prettier/recommended"\n',
          ""
        )
        .replace("prettier,\n", "")
        .replace(
          " {\n" +
            "    rules: {\n" +
            '      "prettier/prettier": "warn",\n' +
            "    },\n" +
            "  },",
          ""
        )
    }

    fs.writeFileSync(
      path.join(enteredTargetDir, "eslint.config.mjs"),
      eslintConfig
    )

    setStep(Steps.Install)

    const child = spawn(pkgManager, ["install"], {
      cwd: enteredTargetDir,
      //Fixes issue when running on windows https://stackoverflow.com/a/54515183
      shell: process.platform === "win32",
    })

    child.on("error", () => {
      setStep(Steps.InstallError)
    })

    child.on("close", (code) => {
      setStep(code === 0 ? Steps.Finish : Steps.InstallError)
    })
  }, [enteredTargetDir, selectedTemplate, prettier])

  return (
    <Box flexDirection="column">
      <Step
        status={
          step > Steps.IncorrectDir
            ? "success"
            : step === Steps.IncorrectDir
              ? "error"
              : "userInput"
        }
        label={"Game directory"}
        view={
          (step === Steps.Target && (
            <UncontrolledTextInput
              placeholder={PLACEHOLDER}
              onSubmit={onSubmitTarget}
            />
          )) || <Text>{enteredTargetDir}</Text>
        }
      />
      {step === Steps.IncorrectDir && (
        <Step
          status={"error"}
          label={"Incorrect game directory (package.json not found)"}
        />
      )}

      {step >= Steps.Type && (
        <Step
          status={step > Steps.Type ? "success" : "userInput"}
          label={
            step > Steps.Type
              ? `Selected project type ${selectedTemplate}`
              : "Select your project type"
          }
          view={
            step === Steps.Type && (
              <Select
                items={templates}
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                onSubmit={() => setStep(Steps.Prettier)}
              />
            )
          }
        />
      )}

      {step >= Steps.Prettier && (
        <Step
          status={step > Steps.Prettier ? "success" : "userInput"}
          label={
            step > Steps.Prettier
              ? `prettier: ${prettier}`
              : "Do you want to add prettier code formatter? You can find more about it here: https://prettier.io/"
          }
          view={
            step === Steps.Prettier && (
              <Select
                items={[
                  { label: "No", value: "no" },
                  { label: "Yes", value: "yes" },
                ]}
                value={prettier}
                onChange={(value) => setPrettier(value)}
                onSubmit={() => onSubmitPrettier()}
              />
            )
          }
        />
      )}

      {step >= Steps.PackageJSON && (
        <Step
          status={step === Steps.PackageJSON ? "waiting" : "success"}
          label="package.json"
        />
      )}
      {step >= Steps.Vite && (
        <Step
          status={step === Steps.Vite ? "waiting" : "success"}
          label="vite config"
        />
      )}
      {step >= Steps.Eslint && (
        <Step
          status={step === Steps.Eslint ? "waiting" : "success"}
          label="eslint config"
        />
      )}
      {step >= Steps.Install && (
        <Step
          status={
            step > Steps.InstallError
              ? "success"
              : step === Steps.InstallError
                ? "error"
                : "waiting"
          }
          label={
            step > Steps.InstallError
              ? `Dependencies installed successfully!`
              : step === Steps.InstallError
                ? `Failed to install dependencies`
                : `Installing dependencies...`
          }
        />
      )}
      {step === Steps.Finish && (
        <Step
          status={"success"}
          label={`Migration to single package done. ${prettier === "yes" ? `You might have some prettier related warnings when you run lint. You can fix them by running "${pkgManager === "yarn" ? "yarn lint --fix" : "npm run lint -- --fix"}"` : ""}`}
        />
      )}
    </Box>
  )
}
