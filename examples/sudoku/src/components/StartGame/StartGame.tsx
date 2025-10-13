import React, { useState, useEffect, useMemo } from "react"
import styled from "styled-components/macro"
import checkmarkImg from "./checkmark.svg"
import starImg from "./star.svg"
import { rel } from "../../style/rel"
import { Difficulty } from "sudoku-gen/dist/types/difficulty.type"
import { range } from "../../lib/range"
import { useAtomValue } from "jotai"
import { $game } from "../../state/$game"

export function StartGame() {
  const game = useAtomValue($game)

  const [difficulty, setDifficulty] = useState<Difficulty>()

  const options = useMemo<
    Array<{
      label: string
      stars: number
      difficulty: Difficulty
    }>
  >(
    () => [
      { label: Rune.t("Easy"), stars: 1, difficulty: "easy" },
      { label: Rune.t("Medium"), stars: 2, difficulty: "medium" },
      { label: Rune.t("Hard"), stars: 3, difficulty: "hard" },
      { label: Rune.t("Expert"), stars: 4, difficulty: "expert" },
    ],
    []
  )

  useEffect(() => {
    if (difficulty) {
      const handle = setTimeout(() => Rune.actions.startGame(difficulty), 500)
      return () => clearTimeout(handle)
    }
  }, [difficulty])

  if (!game) return <Root />

  return (
    <Root>
      <Box>
        <Header>{Rune.t("Choose Difficulty")}</Header>
        <Content>
          {options.map((option) => (
            <Option
              key={option.difficulty}
              active={difficulty === option.difficulty}
              onClick={() => setDifficulty(option.difficulty)}
            >
              <Checkmark
                src={checkmarkImg}
                visible={difficulty === option.difficulty}
              />
              <Label>{option.label}</Label>
              <Stars>
                {range(option.stars).map((i) => (
                  <Star key={i} src={starImg} />
                ))}
              </Stars>
            </Option>
          ))}
        </Content>
      </Box>
    </Root>
  )
}

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(11, 28, 36, 0.8);
  backdrop-filter: blur(${rel(2)});
`

const Box = styled.div`
  width: ${rel(272)};
  border-radius: ${rel(12)};
  overflow: hidden;
`

const Header = styled.div`
  background: #f8d5af;
  color: #1f2f44;
  font-weight: 600;
  font-size: ${rel(20)};
  padding: ${rel(24)} 0 ${rel(15)};
  display: flex;
  justify-content: center;
`

const Content = styled.div`
  background: linear-gradient(180deg, #2d3542 0%, #403e3f 100%);
  padding: ${rel(25)} ${rel(21)};
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: ${rel(9)};
  }
`

const Option = styled.div<{ active: boolean }>`
  background: ${({ active }) => (active ? "#4b6e87" : "transparent")};
  border-radius: ${rel(14)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${rel(32)};
  border: ${rel(2)} solid #4b6e87;
`

const Checkmark = styled.img<{ visible: boolean }>`
  width: ${rel(24)};
  height: ${rel(24)};
  margin: 0 ${rel(15)} 0 ${rel(17)};
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`

const Label = styled.div`
  font-weight: 600;
  font-size: ${rel(16)};
  color: #f8d5af;
  flex: 1;
`

const Stars = styled.div`
  width: ${rel(77)};
  margin: 0 ${rel(10)};
  display: flex;
  align-items: center;
`

const Star = styled.img`
  width: ${rel(23)};
  height: ${rel(23)};
  margin: 0 ${rel(-2)};
`
