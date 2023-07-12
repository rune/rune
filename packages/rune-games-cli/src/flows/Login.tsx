import { Text, Box } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useEffect, useMemo, useCallback } from "react"

import { Step } from "../components/Step.js"
import { useCheckVerification } from "../gql/useCheckVerification.js"
import { useMe } from "../gql/useMe.js"
import { useStartVerification } from "../gql/useStartVerification.js"
import { useUpdateDevTeamById } from "../gql/useUpdateDevTeamById.js"
import { formatApolloError } from "../lib/formatApolloError.js"
import { storage } from "../lib/storage/storage.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

const checkVerificationEvery = 2000
const alreadyHasAuthToken = !!storage.get("authToken")

export function Login() {
  const [authToken, setAuthToken] = useState(() => storage.get("authToken"))
  const { me, meLoading, meError } = useMe({ skip: !authToken })
  const [email, setEmail] = useState("")
  const [newHandle, setNewHandle] = useState("")
  const [handleSubmitted, setHandleSubmitted] = useState(false)
  const [twitter, setTwitter] = useState("")
  const {
    startVerification,
    startVerificationLoading,
    startVerificationError,
    verificationToken,
  } = useStartVerification()
  const {
    checkVerification,
    checkVerificationLoading,
    checkVerificationError,
    authToken: newAuthToken,
  } = useCheckVerification()
  const {
    updateDevTeamById,
    updateDevTeamByIdLoading,
    updateDevTeamByIdError,
  } = useUpdateDevTeamById()

  const sanitizedEmail = useMemo(() => email.trim().toLowerCase(), [email])

  const submitEmail = useCallback(() => {
    if (sanitizedEmail) startVerification({ email: sanitizedEmail })
  }, [sanitizedEmail, startVerification])

  useEffect(() => {
    if (
      verificationToken &&
      !authToken &&
      !checkVerificationLoading &&
      !checkVerificationError
    ) {
      const handle = setTimeout(() => {
        checkVerification({ verificationToken })
      }, checkVerificationEvery)

      return () => clearTimeout(handle)
    }
  }, [
    authToken,
    checkVerification,
    checkVerificationError,
    checkVerificationLoading,
    verificationToken,
  ])

  useEffect(() => {
    if (newAuthToken) {
      storage.set("authToken", newAuthToken)
      setAuthToken(newAuthToken)
    }
  }, [newAuthToken])

  const sanitizedNewHandle = newHandle.trim()
  const sanitizedTwitter = twitter.trim()

  const submitDevData = useCallback(() => {
    if (me && sanitizedNewHandle) {
      updateDevTeamById({
        id: me.id,
        patch: {
          handle: sanitizedNewHandle,
          twitter: sanitizedTwitter ?? undefined,
        },
      })
    }
  }, [me, sanitizedNewHandle, sanitizedTwitter, updateDevTeamById])

  useEffect(() => {
    if (meError?.message.includes("[tango][AUTH_FAILED]")) {
      storage.delete("authToken")
    }
  }, [meError?.message])

  useEffect(() => {
    if (updateDevTeamByIdError) {
      setHandleSubmitted(false)
    }
  }, [updateDevTeamByIdError])

  if (alreadyHasAuthToken && meLoading) {
    return <Step status="waiting" label="Checking authorization" />
  }

  if (meError) {
    return (
      <Step
        status="error"
        label={formatApolloError(meError, {
          "[tango][AUTH_FAILED]": "Authentication failed. Please try again.",
          default: "Something went wrong",
        })}
      />
    )
  }

  return (
    <Box flexDirection="column">
      {!alreadyHasAuthToken && (
        <>
          <Step
            status={
              verificationToken
                ? "success"
                : startVerificationLoading
                ? "waiting"
                : "userInput"
            }
            label={(status) =>
              status === "success"
                ? "Email sent"
                : status === "waiting"
                ? "Sending verification email"
                : "Enter your email to login or create a new account"
            }
            view={(status) =>
              status === "userInput" && (
                <Box flexDirection="column">
                  {startVerificationError && (
                    <Text color="red">
                      {formatApolloError(startVerificationError, {
                        "[tango][VERIFICATION_RATE_LIMIT]":
                          "It looks like you’ve already tried to verify this email recently, please wait a bit before trying again",
                        default: `Something went wrong`,
                      })}
                    </Text>
                  )}
                  <Box>
                    <Text>Email: </Text>
                    <TextInput
                      placeholder="email@example.com"
                      value={email}
                      onChange={setEmail}
                      onSubmit={submitEmail}
                    />
                  </Box>
                </Box>
              )
            }
          />
          {!!verificationToken && (
            <Step
              status={
                authToken
                  ? "success"
                  : checkVerificationError
                  ? "error"
                  : "waiting"
              }
              label={(status) =>
                status === "success"
                  ? "Email confirmed"
                  : checkVerificationError
                  ? formatApolloError(checkVerificationError, {
                      "[tango][JWT_EXPIRED]":
                        "It looks like the email link has expired, please try again",
                      default: `Something went wrong. Please try again`,
                    })
                  : `An email was sent to \`${sanitizedEmail}\`, please open it and click the link inside to proceed`
              }
            />
          )}
        </>
      )}

      {authToken && (
        <Step
          status={handleSubmitted ? "success" : "userInput"}
          label={(status) =>
            status === "success"
              ? `Handle: ${newHandle}`
              : "To finish setting up your account, please enter your desired handle"
          }
          view={(status) =>
            (status === "userInput" || updateDevTeamByIdError) && (
              <Box flexDirection="column">
                {status === "userInput" && updateDevTeamByIdError && (
                  <Text color="red">
                    {formatApolloError(updateDevTeamByIdError, {
                      'violates check constraint "dev_team_handle_check"':
                        "Invalid input, handles can contain only lowercase letters, numbers, and underscores/dot/hyphens (no spaces)",
                      'violates unique constraint "dev_team_handle_key"':
                        "This handle is already taken, please choose another",
                      'violates check constraint "dev_team_twitter_regex"':
                        "Invalid twitter handle",
                      default: "Something went wrong",
                    })}
                  </Text>
                )}
                {status === "userInput" && (
                  <Box>
                    <Text>Handle: </Text>
                    <TextInput
                      placeholder="cool-dev"
                      value={newHandle}
                      onChange={setNewHandle}
                      onSubmit={() => setHandleSubmitted(true)}
                    />
                  </Box>
                )}
              </Box>
            )
          }
        />
      )}

      {handleSubmitted && (
        <Step
          status={
            updateDevTeamByIdLoading || meLoading ? "waiting" : "userInput"
          }
          label={(status) =>
            status === "success"
              ? `Dev Data saved successfully!`
              : status === "waiting"
              ? updateDevTeamByIdLoading
                ? "Saving your dev data"
                : "Checking authorization"
              : "Your twitter handle (optional)"
          }
          view={(status) =>
            status === "userInput" && (
              <Box>
                <Text>Twitter: </Text>
                <TextInput
                  placeholder=""
                  value={twitter}
                  onChange={setTwitter}
                  onSubmit={submitDevData}
                />
              </Box>
            )
          }
        />
      )}
    </Box>
  )
}
