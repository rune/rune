export const explainRuneProjectToolDescription = `Analyzes existing Rune game projects to explain structure and provide guidance for how to use the Rune SDK correctly.

AGENT INSTRUCTIONS:
Identify Rune projects by checking for "rune-sdk" dependency in package.json.
This tool returns same information as create-rune-game tool, but for existing projects. 
Run this tool if you have a project that uses the Rune SDK but has no copilot-instructions.md file.
Run this tool to learn more about the Rune API and how to use it.
Run this tool before making any changes to a project that uses the rune-sdk but has no .github/copilot-instructions.md file.`

export const projectPathParameterDescription =
  "Path to Rune game project directory to analyze."

export const projectNotFoundError = (projectPath: string) =>
  `Error: Project directory not found at ${projectPath}`

export const notRuneProjectError = `Error: Not a valid Rune project. A valid project requires:
- package.json with rune-games-sdk dependency
- logic.js/ts for game state management
- client.js/ts or similar for rendering`

export const explainProjectResponse = (projectDetails: {
  name: string
  isTypeScript: boolean
  hasReact: boolean
  hasSvelte: boolean
  hasVue: boolean
  hasPixi: boolean
  logicFilePath: string
  clientFilePath: string
  otherImportantFiles: string[]
}) => {
  const frameworkInfo = projectDetails.hasReact
    ? "React"
    : projectDetails.hasSvelte
      ? "Svelte"
      : projectDetails.hasVue
        ? "Vue"
        : "Vanilla JavaScript"

  const renderingLibrary = projectDetails.hasPixi
    ? " with PixiJS for rendering"
    : ""

  const language = projectDetails.isTypeScript ? "TypeScript" : "JavaScript"

  return `# Rune Project Analysis: ${projectDetails.name}

This is a ${language} Rune game project using ${frameworkInfo}${renderingLibrary}.

## Project Structure Overview

Rune games follow a specific architecture with two main components:

### 1. Game Logic (${projectDetails.logicFilePath})
- Contains the core game state and logic
- Must be **deterministic** - same inputs always produce same outputs
- Handles game actions, state updates, and win conditions
- Cannot access browser APIs, DOM, or generate random numbers outside Rune.random()

### 2. Game UI (${projectDetails.clientFilePath})
- Renders the game state to the screen
- Handles user inputs and sends actions to the game logic
- Can use any UI framework (${frameworkInfo})
- Not required to be deterministic

## Key Files
- **${projectDetails.logicFilePath}**: Core game state and logic (deterministic)
- **${projectDetails.clientFilePath}**: Game UI and rendering
${projectDetails.otherImportantFiles.map((file) => `- **${file}**`).join("\n")}

## Editing Guidelines

When modifying this Rune project:

1. **Keep logic.js/ts deterministic**:
   - Use Rune.random() instead of Math.random()
   - Avoid Date, setTimeout, fetch, or any non-deterministic APIs
   - Any operations that change game state must happen through actions

2. **Separate logic from presentation**:
   - Game state changes should only happen in logic.js/ts
   - Client code should only render state and send actions

3. **Test your changes**:
   - Use "npm run dev" to test locally
   - Test multiplayer functionality if applicable

4. **Performance considerations**:
   - Optimize for mobile devices - Rune games run primarily on phones
   - Keep bundle size small
   - Minimize DOM updates and expensive operations

This architecture ensures your game works consistently across all players in multiplayer games.

## Next Steps
- Ask the user if they want to start the Rune dev server so they can preview the game
- Run the check-rune-project-errors tool to identify any issues in the project`
}
