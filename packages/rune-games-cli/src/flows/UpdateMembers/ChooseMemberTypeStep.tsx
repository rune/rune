import React, { useState, useCallback, useEffect, useMemo } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { GameDevType } from "../../generated/types.js"

const items = Object.values(GameDevType)
  .map((value) => ({
    label: value,
    value,
  }))
  .sort((i1, i2) => i1.label.localeCompare(i2.value))

export function ChooseMemberTypeStep({
  currentMemberType,
  onComplete,
}: {
  currentMemberType: GameDevType | null | undefined
  onComplete: (memberType: GameDevType) => void
}) {
  const [memberType, setMemberType] = useState<GameDevType>(GameDevType.TESTER)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (currentMemberType) setMemberType(currentMemberType)
  }, [currentMemberType])

  const onSubmit = useCallback(() => setSubmitted(true), [])

  const chosenMemberTypeLabel = useMemo(
    () => `${memberType} role selected`,
    [memberType]
  )

  useEffect(() => {
    if (submitted) onComplete(memberType)
  }, [memberType, onComplete, submitted])

  return (
    <Step
      status={submitted ? "success" : "userInput"}
      label={submitted ? chosenMemberTypeLabel : "Select a role"}
      view={
        !submitted && (
          <Select
            items={items}
            value={memberType}
            onChange={setMemberType}
            onSubmit={onSubmit}
          />
        )
      }
    />
  )
}
