# rune-mcp

A Model Context Protocol (MCP) server for creating and developing multiplayer mobile games with Rune SDK. This project enables AI assistants like GitHub Copilot to assist developers in creating, developing, and debugging Rune games through specialized tools and templates.

## Overview

Rune is a platform for creating and playing multiplayer mobile games with integrated voice chat. This MCP server provides tools to:

- Create new Rune game projects with various templates (JavaScript, TypeScript, React, Vue, Svelte, etc.)
- Check for project errors and provide validation
- Manage development servers
- Provide guidance on Rune game development best practices

The server integrates with VS Code and GitHub Copilot to provide an enhanced development experience through custom tools.

## Installation

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

## Development

To test locally using the mcp inspector, you can run

```bash
cd packages/rune-mcp
yarn inspect
```

### Testing in VS Code with GitHub Copilot

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
