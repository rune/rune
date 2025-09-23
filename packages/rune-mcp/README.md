# rune-mcp

⚠️ __ALPHA RELEASE!__ ⚠️

A Model Context Protocol (MCP) server to help you develop multiplayer games with the Rune SDK. This project enables AI assistants like GitHub Copilot to understand the Rune SDK and help you rapidly iterate on building and debugging Rune games through specialized tools and templates.

## Quickstart: VSCode + Github Copilot
- Create an empty folder (e.g`ai-game`) and open it in VSCode
- Create a `.vscode` directory inside the game folder
- Inside that directory create a file called `mcp.json` with this content:
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
- When you save the `mcp.json` file, you should see a little "Start" button appear:
   <p align="center">
   <img width="796" alt="Rune mcp.json setup in VSCode" src="https://github.com/user-attachments/assets/524463d6-71b6-4b9c-ac8b-2c5c15ea8106" />
   </p>
- Now press "Start" and then open up the Copilot window.
- **IMPORTANT**: Set Copilot to "Agent" mode using `Claude 3.7 Sonnet`. You should see "🛠️ 9" in copilot since it has detected the 9 Rune tools:
   <p align="center">
   <img width="400" alt="Agent Mode Setup in VSCode" src="https://github.com/user-attachments/assets/5d6ec65a-3346-4b77-bfed-8a8cbdd611c5" />
   </p>
- Now type a prompt to build a Rune game. Here's an example prompt: "I'd like to build a Rune game. The game I had in mind is a 2D maze like puzzle game where you have to move some blocks around to get to the end of the maze. Can you build this Rune game for me?"
   <p align="center">
   <img width="1398" style="display: block; margin: 0 auto;" alt="Building a Rune Game with Copilot" src="https://github.com/user-attachments/assets/af231f2f-3362-4d02-84e6-0d4d8da21b53" />
   </p>


## Support
Please join our [Discord server](https://discord.gg/rune-ai) for help and to report any issues you find! We're excited to help you build your first Rune game with AI

[![Discord Follow](https://dcbadge.vercel.app/api/server/rune-devs?style=flat)](https://discord.gg/rune-ai)


## Contributing

To contribute to this project, please make sure to:

1. Build and test your changes locally
2. Follow the code style guidelines
3. Update documentation as needed

## Local Development
<details>
<summary>Toggle to read more on how you can improve the Rune MCP server</summary>


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

</details>

## License

MIT
