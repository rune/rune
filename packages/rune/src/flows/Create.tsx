import { spawn } from "child_process"
import fs from "fs"
import { Box, Text } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import React, { useCallback, useEffect } from "react"

import { Choose } from "../components/Choose.js"
import { Select } from "../components/Select.js"
import { Step } from "../components/Step.js"
import { createGameFromTemplate, templates } from "../lib/create.js"
import { formatTargetDir } from "../lib/files.js"
import { installDependenciesForProject } from "../lib/install.js"

enum Steps {
  Target,
  Overwrite,
  CancelOverwrite,
  SelectTemplate,
  Creating,
  PromptInstall,
  SkipInstall,
  Installing,
  InstallError,
  PostInstall,
}

const defaultProjectName = "rune-game"

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"

function formatRunCommand(command: string) {
  return `${pkgManager}${pkgManager === "yarn" ? "" : " run"} ${command}`
}

export function Create({ args }: { args: string[] }) {
  const [targetDir, setTargetDir] = React.useState("")
  const [step, setStep] = React.useState(Steps.Target)
  const [exists, setExists] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    "javascript"
  )
  const [overwrite, setOverwrite] = React.useState(false)
  const onSubmitTarget = useCallback(
    (value: string) => {
      const targetDir = formatTargetDir(value || defaultProjectName)
      const exists = fs.existsSync(targetDir)
      setTargetDir(targetDir)
      setExists(exists)
      setStep(exists ? Steps.Overwrite : Steps.SelectTemplate)
    },
    [setTargetDir, setStep]
  )
  const onCreate = useCallback(() => {
    createGameFromTemplate({
      overwrite,
      targetDir,
      template: selectedTemplate || "javascript",
    }).then(() => {
      setStep(Steps.PromptInstall)
    })
  }, [targetDir, overwrite, selectedTemplate, setStep])

  const onInstall = useCallback(() => {
    installDependenciesForProject({ pathToProject: targetDir })
      .then(() => {
        setStep(Steps.PostInstall)
      })
      .catch(() => {
        setStep(Steps.InstallError)
      })
  }, [targetDir])

  const onPostInstall = useCallback(() => {
    process.chdir(targetDir)
    spawn(pkgManager, ["run", "dev", "--clearScreen=false"], {
      stdio: "inherit",
      //Fixes issue when running on windows https://stackoverflow.com/a/54515183
      shell: process.platform === "win32",
    })
  }, [targetDir])

  useEffect(() => {
    if (args[0]) {
      onSubmitTarget(args[0])
    }
  }, [args, onSubmitTarget])

  useEffect(() => {
    if (step === Steps.Creating) {
      onCreate()
    }

    if (step === Steps.Installing) {
      onInstall()
    }

    if (step === Steps.PostInstall) {
      onPostInstall()
    }
  }, [step, onCreate, onInstall, onPostInstall])

  return (
    <Box flexDirection="column">
      <Step
        status={step > Steps.Target ? "success" : "userInput"}
        label={
          step > Steps.Target
            ? `Will create a game in "${targetDir}"`
            : "Game directory name"
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

      {step === Steps.CancelOverwrite ? (
        <Text color="red">Operation cancelled</Text>
      ) : (
        exists && (
          <Step
            status={step > Steps.Overwrite ? "success" : "userInput"}
            label={
              step > Steps.Overwrite
                ? `Will overwrite existing directory`
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
                      setStep(Steps.SelectTemplate)
                    } else {
                      setStep(Steps.CancelOverwrite)
                    }
                  }}
                />
              )
            }
          />
        )
      )}

      {step >= Steps.SelectTemplate && (
        <Step
          status={step > Steps.SelectTemplate ? "success" : "userInput"}
          label={
            step > Steps.SelectTemplate
              ? `Selected ${selectedTemplate} template`
              : "Select a template"
          }
          view={
            step === Steps.SelectTemplate && (
              <Select
                items={templates}
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                onSubmit={() => setStep(Steps.Creating)}
              />
            )
          }
        />
      )}

      {step >= Steps.Creating && (
        <Step
          status={step > Steps.Creating ? "success" : "waiting"}
          label={
            step > Steps.Overwrite
              ? `Game directory created!`
              : `Creating game directory...`
          }
        />
      )}

      {step === Steps.PromptInstall && (
        <Step
          status={step > Steps.PromptInstall ? "success" : "userInput"}
          label={`Install using ${pkgManager} + open Dev UI?`}
          view={
            step <= Steps.PromptInstall && (
              <Choose
                options={["Yes", "No"]}
                onSubmit={(response) => {
                  const install = response === "Yes"

                  if (install) {
                    setStep(Steps.Installing)
                  } else {
                    setStep(Steps.SkipInstall)
                  }
                }}
              />
            )
          }
        />
      )}
      {step >= Steps.Installing && (
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

      {(step === Steps.SkipInstall || step === Steps.InstallError) && (
        <Text>{`
To start the project, run:
  cd ${targetDir}
  ${pkgManager} install
  ${formatRunCommand("dev")}
`}</Text>
      )}

      {step === Steps.PostInstall && (
        <Text>{`
To start the project next time, run:
  cd ${targetDir}
  ${formatRunCommand("dev")}
`}</Text>
      )}
    </Box>
  )
}
