import { jest } from "@jest/globals"

import { build, Logger } from "vite"
import path from "node:path"
import dusk, { ViteDuskPluginOptions } from "../src/index.js"
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

export const buildFixture = async (
  fixtureName: string,
  logger?: Logger,
  options?: Omit<ViteDuskPluginOptions, "logicPath">
) => {
  const { output } = (await build({
    root: path.resolve(fixturesPath, fixtureName),
    build: {
      write: false,
    },
    customLogger: logger || createLogger(),
    plugins: [
      dusk({
        logicPath: path.resolve(fixturesPath, fixtureName, "logic.ts"),
        ...(options || {}),
      }),
    ],
  })) as RollupOutput
  return output
}
