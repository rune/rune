import React, { useEffect } from "react"
import styled from "styled-components/macro"
import { getSudoku } from "sudoku-gen"

const sudoku = getSudoku("easy")

const board = sudoku.puzzle.split("").reduce((acc, cell, i) => {
  const row = Math.floor(i / 9)
  const col = i % 9

  if (!acc[row]) acc[row] = []
  acc[row][col] = cell

  return acc
}, [] as string[][])

export function App() {
  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId }) => {
        console.log("visualUpdate", { newGame, players, yourPlayerId })
      },
    })
  }, [])

  return (
    <Root>
      {board.map((row, i) => (
        <div style={{ display: "flex" }} key={i}>
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                width: `${100 / 9}vw`,
                height: `${100 / 9}vw`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`
