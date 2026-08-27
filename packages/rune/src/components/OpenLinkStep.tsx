import { Box, Text } from "ink"
import open from "open"
import React, { useState } from "react"

import { Choose } from "./Choose.js"
import { Step } from "./Step.js"

export function OpenLinkStep({
  label,
  link,
  openedLabel,
  promptToOpen = true,
}: {
  label: string
  link: string
  openedLabel: string
  promptToOpen?: boolean
}) {
  const [status, setStatus] = useState<
    "waiting" | "opened" | "failedBrowser" | "skipped"
  >("waiting")

  return (
    <Box flexDirection="column">
      <Text>
        {label}: <Text color="green">{link}</Text>
      </Text>

      {promptToOpen &&
        (status === "opened" ? (
          <Step status="success" label={openedLabel} />
        ) : status === "failedBrowser" ? (
          <Step
            status="error"
            label="Failed to open your default browser. Please open the link manually"
          />
        ) : status === "skipped" ? (
          <Step status="success" label="Done." />
        ) : (
          <Step
            status={"userInput"}
            label={"Open in default browser?"}
            view={
              <Choose
                options={["Yes", "No"]}
                onSubmit={(response) => {
                  const shouldOpen = response === "Yes"

                  if (shouldOpen) {
                    open(link)
                      .then(() => {
                        setStatus("opened")
                      })
                      .catch(() => {
                        setStatus("failedBrowser")
                      })
                  } else {
                    setStatus("skipped")
                  }
                }}
              />
            }
          />
        ))}
    </Box>
  )
}
