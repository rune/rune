# rune-mcp

⚠️ __ALPHA RELEASE!__ ⚠️

A Model Context Protocol (MCP) server for creating and developing multiplayer mobile games with the Rune SDK. This project enables AI assistants like GitHub Copilot to assist developers in creating, developing, and debugging Rune games through specialized tools and templates.

## Quickstart: VSCode + Github Copilot
1. Create an empty folder (e.g`ai-game`) and open it in VSCode
2. Create a `.vscode` directory inside the game folder
3. Inside that directory create a file called `mcp.json` with this content:
   ```json
   {
     "servers": {
       "Rune": {
         "type": "stdio",
         "command": "npx",
         "args": ["rune-mcp@latest"]
       }
     }
   }
   ```
4. When you save the `mcp.json` file, you should see a little "Start" button appear:
<!-- Screenshot coming soon -->
5. Now press "Start" and then open up the Copilot window.
6. IMPORTANT: Set Copilot to "Agent" mode using `Claude 3.7 Sonnet`. You should see "🛠️ 9" in copilot since it has detected the 9 Rune tools:
<!-- Screenshot coming soon -->
7. Now type a prompt to build a Rune game. Here's an example prompt: "I'd like to build a Rune game. The game I had in mind is a 2D maze like puzzle game where you have to move some blocks around to get to the end of the maze. Can you build this Rune game for me?"
<!-- Grab some coffee -->

## Support
Please join our [Discord server](https://discord.gg/rune-devs) for help and to report any issues you find! We're excited to help you build your first Rune game with AI

[![Discord Follow](https://dcbadge.vercel.app/api/server/rune-devs?style=flat)](https://discord.gg/rune-devs)

## Local Development

### Installation

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

To test locally using the mcp inspector, you can run

```bash
cd packages/rune-mcp
yarn inspect
```

### Testing local code in VS Code with GitHub Copilot

1. Create a directory to test with and open that folder in vs code.
2. Create a `.vscode` directory in that folder
3. Inside that directory create a file called `mcp.json`
4. Add the following
   ```json
   {
     "servers": {
       "Rune": {
         "type": "stdio",
         "command": "node",
         "args": ["<local-path>/rune/packages/rune-mcp/dist/index.js"]
       }
     }
   }
   ```
   but replace <local-path> with the full path to the rune-mcp repo on your local system, such as `/User/david/Projects` or something similar.
5. Make sure you have run `yarn build` in the rune-mcp project so the `dist/index.js` file exists.

For further information on using MCP Servers in VS Code with Github Copilot, see: https://code.visualstudio.com/docs/copilot/chat/mcp-servers

**_Note:_** VS Code caches the server tool definitions so if you are modifying them you may have to restart VS Code for the agent to receive the new tools definitions.

## Available MCP Tools

This server provides several custom tools for GitHub Copilot to use when assisting with Rune game development:

- **create-rune-game**: Creates a new Rune game project from a template
- **restart-dev-server**: Restarts the development server for a Rune project
- **check-dev-server**: Checks the status of a Rune development server
- **check-rune-project-errors**: Validates the Rune project for errors
- **explain-rune-project**: Provides explanations about Rune game structure and development

## Project Structure

- `src/`: Source code for the MCP server
  - `index.ts`: Main entry point for the server
  - `services/`: Core services for project management
  - `text/`: Text definitions for tools
  - `tools/`: MCP tool implementations
  - `utils/`: Utility functions
- `templates/`: Template projects for different frameworks and languages
  - Various templates for JavaScript, TypeScript, React, Vue, Svelte, etc.
- `prompts/`: Guidance for GitHub Copilot

## Contributing

To contribute to this project, please make sure to:

1. Build and test your changes locally
2. Follow the code style guidelines
3. Update documentation as needed

## License

MIT
