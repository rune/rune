import styled from "styled-components/macro"
import { rel } from "../../../style/rel"
import { useAtomValue } from "jotai"
import { $guesses } from "../../../state/$state"
import { useRef, useMemo, useCallback, memo } from "react"
import { art } from "../art/art"
import { remap } from "../../../lib/remap"

const positions: { [i: number]: number } = {}
const rotations: { [i: number]: number } = {}

export const RisingGuessesView = memo(() => {
  const guesses = useAtomValue($guesses)
  const initialLength = useRef(guesses.length)
  const newGuesses = useMemo(
    () => guesses.slice(initialLength.current),
    [guesses]
  )

  const getPosition = useCallback((i: number) => {
    if (positions[i] === undefined) positions[i] = Math.random()
    return positions[i]
  }, [])

  const getRotation = useCallback((i: number) => {
    if (rotations[i] === undefined) rotations[i] = Math.random()
    return rotations[i]
  }, [])

  return (
    <Root>
      {newGuesses.map((guess, i) => (
        <PositionAndRocking position={getPosition(i)} key={i}>
          <Scale>
            <Guess rotation={getRotation(i)}>
              <img src={art.emotions[guess.emotion]} />
              <span>+</span>
              <img src={art.animals[guess.animal]} />
            </Guess>
          </Scale>
        </PositionAndRocking>
      ))}
    </Root>
  )
})

const Root = styled.div``

const PositionAndRocking = styled.div<{ position: number }>`
  animation:
    rocking 800ms ease-in-out infinite,
    rising 1s linear forwards;
  position: absolute;
  left: ${({ position }) => `${remap(position, [0, 1], [15, 85])}vw`};
  bottom: 0;
`

const Scale = styled.div`
  animation: shrinking 3s ease-out forwards;
`

const Guess = styled.div<{ rotation: number }>`
  display: flex;
  align-items: center;
  img {
    width: ${rel(32)};
    height: ${rel(32)};
  }
  span {
    color: #e4faff;
    text-shadow: 0 ${rel(4.8)} 0 rgba(0, 0, 0, 0.35);
    font-size: ${rel(34)};
    margin: 0 ${rel(2)};
  }
  transform: translateX(-50%)
    rotate(${({ rotation }) => remap(rotation, [0, 1], [-20, 20])}deg);
`
