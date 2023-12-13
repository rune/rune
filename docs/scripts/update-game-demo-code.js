const fs = require("fs")
const path = require("path")

fs.writeFileSync(
  path.resolve(__dirname, "../src/pages/demoCode.json"),
  JSON.stringify(
    {
      logic: fs
        .readFileSync(
          path.resolve(__dirname, "../../examples/tic-tac-toe/logic.js")
        )
        .toString(),
      client: fs
        .readFileSync(
          path.resolve(__dirname, "../../examples/tic-tac-toe/client.js")
        )
        .toString(),
    },
    null,
    2
  ) + "\n"
)
