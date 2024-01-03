import { describe, test, expect, jest } from "@jest/globals"

import { useMyGames } from "./useMyGames"

jest.mock("react", () => ({
  useMemo: (fn: () => object) => fn(),
}))

const devId = 1
const onlyMyGames = [
  {
    title: "Z My Game",
    gameDevs: {
      nodes: [
        {
          userId: devId,
        },
      ],
    },
  },
  {
    title: "A My Game",
    gameDevs: {
      nodes: [
        {
          userId: devId,
        },
      ],
    },
  },
]
const collaborationGames = [
  {
    title: "Z Collaboration Game",
    gameDevs: {
      nodes: [
        {
          userId: devId + 1,
        },
        {
          userId: devId,
        },
        {
          userId: devId + 2,
        },
      ],
    },
  },
  {
    title: "A Collaboration Game",
    gameDevs: {
      nodes: [
        {
          userId: devId + 1,
        },
        {
          userId: devId,
        },
        {
          userId: devId + 2,
        },
      ],
    },
  },
]
const otherGames = [
  {
    title: "Z Other Game",
    gameDevs: {
      nodes: [
        {
          userId: devId + 1,
        },
        {
          userId: devId + 2,
        },
      ],
    },
  },
  {
    title: "A Other Game",
    gameDevs: {
      nodes: [
        {
          userId: devId + 1,
        },
      ],
    },
  },
]

describe("useMyGames", () => {
  test("should get undefined if games is not provided", async () => {
    const label = useMyGames({
      games: undefined,
      devId,
    })

    expect(label).toEqual({ myGames: undefined, otherGames: undefined })
  })
  test("should get sorted games", async () => {
    const games = [...otherGames, ...collaborationGames, ...onlyMyGames]
    const label = useMyGames({
      games,
      devId,
    })

    const expectedMyGames = [
      games.find((g) => g.title === "A Collaboration Game"),
      games.find((g) => g.title === "A My Game"),
      games.find((g) => g.title === "Z Collaboration Game"),
      games.find((g) => g.title === "Z My Game"),
    ]
    const expectedOtherGames = [
      games.find((g) => g.title === "A Other Game"),
      games.find((g) => g.title === "Z Other Game"),
    ]

    expect(label).toEqual({
      myGames: expectedMyGames,
      otherGames: expectedOtherGames,
    })
  })
})
