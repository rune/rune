import fs from "fs"
import { Box, Text } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import path from "path"
import React, { useCallback, useEffect } from "react"
import { fileURLToPath } from "url"

import { Choose } from "../components/Choose.js"
import { Step } from "../components/Step.js"

enum Steps {
  Target,
  Overwrite,
  Creating,
  Done,
  Cancelled,
}

const defaultProjectName = "rune-game"
const templateDir = path.resolve(
  fileURLToPath(import.meta.url),
  "../../../template-vite-react-ts"
)
const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"

function formatRunCommand(command: string) {
  return `${pkgManager}${pkgManager === "yarn" ? "" : " run"} ${command}`
}

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "")
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)

  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue
    }

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

export function Create({ args }: { args: string[] }) {
  const [targetDir, setTargetDir] = React.useState("")
  const [step, setStep] = React.useState(Steps.Target)
  const [exists, setExists] = React.useState(false)
  const [overwrite, setOverwrite] = React.useState(false)
  const onSubmitTarget = useCallback(
    (value: string) => {
      const targetDir = formatTargetDir(value || defaultProjectName)
      const exists = fs.existsSync(targetDir)
      setTargetDir(targetDir)
      setExists(exists)
      setStep(exists ? Steps.Overwrite : Steps.Creating)
    },
    [setTargetDir, setStep]
  )
  const onCreate = useCallback(() => {
    if (overwrite) {
      emptyDir(targetDir)
    } else if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const files = fs.readdirSync(templateDir)

    for (const file of files.filter((f) => f !== "package.json")) {
      copy(path.join(templateDir, file), path.join(targetDir, file))
    }

    // fixes issue where npm removes gitignore file during publish https://github.com/npm/npm/issues/3763
    fs.renameSync(
      path.join(targetDir, "gitignore"),
      path.join(targetDir, ".gitignore")
    )

    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
    )

    pkg.name = targetDir

    fs.writeFileSync(
      path.join(targetDir, "package.json"),
      `${JSON.stringify(pkg, null, 2)}\n`
    )
    setStep(Steps.Done)
  }, [targetDir, overwrite, setStep])

  useEffect(() => {
    if (args[0]) {
      onSubmitTarget(args[0])
    }
  }, [args, onSubmitTarget])

  useEffect(() => {
    if (step === Steps.Creating) {
      onCreate()
    }
  }, [step, onCreate])

  return (
    <Box flexDirection="column">
      <Step
        status={step > Steps.Target ? "success" : "userInput"}
        label={
          step > Steps.Target
            ? `Will create a project in "${targetDir}"`
            : "Project name"
        }
        view={
          step <= Steps.Target && (
            <UncontrolledTextInput
              placeholder={defaultProjectName}
              onSubmit={onSubmitTarget}
            />
          )
        }
      />
      {exists && (
        <Step
          status={step > Steps.Overwrite ? "success" : "userInput"}
          label={
            step > Steps.Overwrite
              ? `Will overwrite existing folder`
              : `Target directory "${targetDir}" is not empty. Remove existing files and continue?`
          }
          view={
            step <= Steps.Overwrite &&
            !overwrite && (
              <Choose
                options={["No", "Yes"]}
                onSubmit={(response) => {
                  const overwrite = response === "Yes"

                  if (overwrite) {
                    setOverwrite(true)
                    setStep(Steps.Creating)
                  } else {
                    setStep(Steps.Cancelled)
                  }
                }}
              />
            )
          }
        />
      )}
      {step === Steps.Cancelled ? (
        <Text>Operation cancelled</Text>
      ) : (
        step >= Steps.Creating && (
          <Step
            status={step > Steps.Creating ? "success" : "waiting"}
            label={
              step > Steps.Overwrite
                ? `Project created!`
                : `Creating project...`
            }
          />
        )
      )}
      {step === Steps.Done && (
        <Text>{`
To start the project, run:
  cd ${targetDir}
  ${pkgManager} install
  ${formatRunCommand("dev")}

To upload your game, run:
  ${formatRunCommand("build")}
  npx rune-games-cli@latest upload
`}</Text>
      )}
    </Box>
  )
}
