import { describe, test, expect } from "@jest/globals"

import { GameDevType, GameVersionStatus } from "../generated/types"

import { gameItemLabel } from "./gameItemLabel"

const game = {
  __typename: "Game" as const,
  id: 1,
  title: "Super Game",
  description: null,
}

const singleGameDev = {
  __typename: "GameDevsConnection" as const,
  nodes: [
    {
      __typename: "GameDev" as const,
      userId: 10,
      displayName: "Game Admin",
      type: GameDevType.ADMIN,
    },
  ],
}

const multipleGameDevs = {
  __typename: "GameDevsConnection" as const,
  nodes: [
    {
      __typename: "GameDev" as const,
      userId: 10,
      displayName: "Game Admin",
      type: GameDevType.ADMIN,
    },
    {
      __typename: "GameDev" as const,
      userId: 10,
      displayName: "Super Game Dev Tester",
      type: GameDevType.TESTER,
    },
  ],
}

const singleActiveGameVersion = {
  __typename: "GameVersionsConnection" as const,
  nodes: [
    {
      __typename: "GameVersion" as const,
      gameId: 100,
      gameVersionId: 1000,
      status: GameVersionStatus.ACTIVE,
    },
  ],
}

const multipleGameVersions = {
  __typename: "GameVersionsConnection" as const,
  nodes: [
    {
      __typename: "GameVersion" as const,
      gameId: 100,
      gameVersionId: 1001,
      status: GameVersionStatus.DRAFT,
    },
    {
      __typename: "GameVersion" as const,
      gameId: 100,
      gameVersionId: 1000,
      status: GameVersionStatus.ACTIVE,
    },
  ],
}

describe("gameItemLabel", () => {
  test("should get label with single dev", async () => {
    const label = gameItemLabel({
      game: {
        ...game,
        gameDevs: singleGameDev,
        gameVersions: singleActiveGameVersion,
      },
      showGameDevs: true,
    })

    expect(label).toBe("Super Game [by Game Admin] (latestVersion: ACTIVE)")
  })
  test("should get label with multiple devs", async () => {
    const label = gameItemLabel({
      game: {
        ...game,
        gameDevs: multipleGameDevs,
        gameVersions: singleActiveGameVersion,
      },
      showGameDevs: true,
    })

    expect(label).toBe(
      "Super Game [by Game Admin + 1 others] (latestVersion: ACTIVE)"
    )
  })
  test("should get label without devs tag", async () => {
    const label = gameItemLabel({
      game: {
        ...game,
        gameDevs: multipleGameDevs,
        gameVersions: singleActiveGameVersion,
      },
      showGameDevs: false,
    })

    expect(label).toBe("Super Game (latestVersion: ACTIVE)")
  })
  test("should get label with latest version status", async () => {
    const label = gameItemLabel({
      game: {
        ...game,
        gameDevs: multipleGameDevs,
        gameVersions: multipleGameVersions,
      },
      showGameDevs: false,
    })

    expect(label).toBe("Super Game (latestVersion: DRAFT)")
  })
})
