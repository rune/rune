export const checkProjectErrorsToolDescription = `Check a Rune project for any errors.

AGENT INSTRUCTIONS:
Use this tool when the user wants to check their Rune project for errors, such as type errors or linting issues.
When errors are found, you should help the user fix them.

Common use cases:
- When the agent has modified the user's code and wants to ensure it is error-free.
- When the user wants to check their code for errors
- When the user is preparing to commit or deploy their code
- When the user is experiencing unexpected behavior that might be due to type errors`

export type CheckErrorsOutput = {
  type: "typescript" | "eslint"
  output: string
}

export const checkProjectErrorsFound = (errors: CheckErrorsOutput[]) =>
  errors.map((error) => `${error.type} errors:\n${error.output}\n`).join("") +
  "Fix the errors and try again."

export const checkProjectErrorsNoneFound = `Great news! No TypeScript or ESLint errors were found in your project.

Your code looks good and follows the style guidelines.`

export const checkProjectErrorsScriptNotFound = (scriptType: string) =>
  `Error: The "${scriptType}" script was not found in your project's package.json.

This tool requires the following npm scripts to be defined:
- "typecheck": to check TypeScript types
- "lint": to run ESLint`

export const projectPathParameterDescription =
  "Path to the game project directory to check for errors."
