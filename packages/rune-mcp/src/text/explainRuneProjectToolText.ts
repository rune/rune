export const explainRuneProjectToolDescription = `Explain, analyze, and provide guidance for a Rune game project to help users understand its structure and how to modify it.

AGENT INSTRUCTIONS:
Use this tool whenever a user asks about:
- What their Rune project is or does
- Understanding a Rune project's structure
- Getting an overview or explanation of a Rune game
- How to edit, extend, or work with a Rune game project
- "Explain this project" or similar requests when working with a Rune project

You can identify a Rune project by checking for the presence of a package.json file with "rune-sdk" as a dependency.
This tool will identify important files, explain their purpose, and provide guidance on how to modify them safely.

This should be the FIRST TOOL you try when users ask for explanations about their existing project in a Rune development context.

Common trigger phrases:
- "Explain this project"
- "What is this project?"
- "How does this game work?"
- "Help me understand this codebase"
- "What is the structure of this project?"
- "How do I modify this game?"

The tool analyzes the entire project and provides a detailed overview of its architecture.`

export const projectPathParameterDescription =
  "Path to the Rune game project directory to analyze and explain."

export const projectNotFoundError = (projectPath: string) =>
  `Error: Project directory not found at ${projectPath}`

export const notRuneProjectError = `Error: This doesn't appear to be a valid Rune project. A valid Rune project typically has:
- A package.json with rune-games-sdk as a dependency
- A logic.js/ts file for game state management
- A client.js/ts or similar file for rendering`

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

  const renderingLibrary = projectDetails.hasPixi ? " with PixiJS for rendering" : ""

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
