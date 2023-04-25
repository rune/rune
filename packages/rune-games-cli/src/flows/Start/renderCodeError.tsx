import { Linter } from "eslint"
import { Text } from "ink"
import React from "react"

import Severity = Linter.Severity

const spaceRegex = /^\s+/

export function renderErrorCodeLine({
  severity,
  code,
  line,
  column,
  endLine,
  endColumn,
}: {
  severity: Severity
  code: string
  line: number
  column: number
  endLine?: number
  endColumn?: number
}) {
  let content = code.split("\n").at(line - 1)

  if (!content) return null

  endColumn = endLine === line ? endColumn ?? column : content?.length

  const spacesAtTheStart = content.match(spaceRegex)?.[0]?.length ?? 0
  content = content.slice(spacesAtTheStart)
  column -= spacesAtTheStart
  endColumn -= spacesAtTheStart

  return (
    <Text color="cyan">
      {line}:{column} {content.slice(0, column - 1)}
      <Text backgroundColor={severity === 2 ? "red" : "yellow"}>
        {content.slice(column - 1, endColumn - 1)}
      </Text>
      {content.slice(endColumn - 1)}
    </Text>
  )
}
