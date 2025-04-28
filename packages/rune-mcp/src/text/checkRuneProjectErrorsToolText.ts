export const checkRuneProjectErrorsToolDescription = `Validates Rune game projects for common errors and issues.

AGENT INSTRUCTIONS:
Use when:
- User has made changes to their game and wants to verify correctness
- Before uploading a game to the platform
- When debugging game issues
- After creating a new game project`

export const projectPathParameterDescription =
  "Path to the Rune game project directory to check. Defaults to current workspace."

export const checkRuneProjectErrorsNoErrorsResponse = `No errors found in the Rune project.
Your game should work correctly on the Rune platform.`

export const checkRuneProjectErrorsFoundResponse = (
  errors: Array<{
    message: string
    severity: string
    file?: string
    line?: number
  }>
) => {
  const formattedErrors = errors
    .map((error) => {
      const location = error.file
        ? ` in ${error.file}${error.line ? `:${error.line}` : ""}`
        : ""
      return `- [${error.severity}]${location}: ${error.message}`
    })
    .join("\n")

  return `Found ${errors.length} issue${errors.length === 1 ? "" : "s"} in the Rune project:

${formattedErrors}

${
  errors.some((e) => e.severity === "error")
    ? "Fix these issues before uploading your game to Rune."
    : "Consider addressing these warnings for a better game experience."
}`
}
