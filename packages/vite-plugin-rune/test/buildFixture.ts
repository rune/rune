import { jest } from "@jest/globals"

import { build, Logger } from "vite"
import path from "node:path"
import rune from "../src/index.js"
import type { RollupOutput } from "rollup"
import { fileURLToPath } from "url"

export const fixturesPath = fileURLToPath(
  new URL("./fixtures", import.meta.url)
)

export function createLogger(): Record<
  Exclude<keyof Logger, "hasWarned" | "hasErrorLogged">,
  jest.Mock
> & {
  hasErrorLogged: () => boolean
  hasWarned: boolean
} {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    warnOnce: jest.fn(),
    error: jest.fn(),
    hasErrorLogged: () => false,
    clearScreen: jest.fn().mockReturnValue(false),
    hasWarned: false,
  }
}

export const buildFixture = async (fixtureName: string, logger?: Logger) => {
  const { output } = (await build({
    root: path.resolve(fixturesPath, fixtureName),
    build: {
      write: false,
    },
    customLogger: logger || createLogger(),
    plugins: [
      rune({ logicPath: path.resolve(fixturesPath, fixtureName, "logic.ts") }),
    ],
  })) as RollupOutput
  return output
}
