export const checkProjectErrorsToolDescription = `Check a Rune project for any errors.

AGENT INSTRUCTIONS:
Use this tool when the user wants to check their Rune project for errors, such as type errors or linting issues.
When errors are found, you should help the user fix them.

Common use cases:
- When the agent has modified the user's code and wants to ensure it is error-free.
- When the user wants to check their code for errors
- When the user is preparing to commit or deploy their code
- When the user is experiencing unexpected behavior that might be due to type errors`

export const checkProjectErrorsTypecheckStarted =
  "Running TypeScript type checker on your project..."

export const checkProjectErrorsLintStarted =
  "No TypeScript errors found. Running ESLint on your project..."

export const checkProjectErrorsTypecheckFailed = (errors: string) =>
  `TypeScript errors found in your project:

\`\`\`
${errors}
\`\`\`

Please fix the TypeScript errors above before proceeding.`

export const checkProjectErrorsLintFailed = (errors: string) =>
  `ESLint errors found in your project:

\`\`\`
${errors}
\`\`\`

Please fix the ESLint errors above.
Rune projects enforce custom ESLint rules to make sure the code will interact correctly with the Rune SDK
so it is important to fix these errors before proceeding.`

export const checkProjectErrorsNoneFound = `Great news! No TypeScript or ESLint errors were found in your project.

Your code looks good and follows the style guidelines.`

export const checkProjectErrorsScriptNotFound = (scriptType: string) =>
  `Error: The "${scriptType}" script was not found in your project's package.json.

This tool requires the following npm scripts to be defined:
- "typecheck": to check TypeScript types
- "lint": to run ESLint`

export const projectPathParameterDescription =
  "Path to the game project directory to check for errors."
