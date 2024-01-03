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
    const label = useMyGames({
      games: [...otherGames, ...collaborationGames, ...onlyMyGames],
      devId,
    })

    const expectedMyGames = [
      collaborationGames[1],
      onlyMyGames[1],
      collaborationGames[0],
      onlyMyGames[0],
    ]
    const expectedOtherGames = [otherGames[1], otherGames[0]]

    expect(label).toEqual({
      myGames: expectedMyGames,
      otherGames: expectedOtherGames,
    })
  })
})
