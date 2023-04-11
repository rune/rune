import styled from "styled-components/macro"
import { OLMap, Pin } from "../OLMap/OLMap"
import React, { useMemo, useState, useEffect } from "react"
import { Coordinate } from "ol/coordinate"
import { RoundInfo } from "./RoundInfo"
import { Overlay } from "../Overlay"
import backButtonImg from "./img/backButton.svg"
import { Rune } from "../../lib/Rune"
import { useAtomValue } from "jotai"
import { $game } from "../../state/game"
import { $players } from "../../state/players"
import { $myPlayerId } from "../../state/myPlayerId"
import { useFlags } from "../../state/flags"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"

export function GuessingMapView({ onBackClick }: { onBackClick: () => void }) {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const myPlayerId = useAtomValue($myPlayerId)
  const { isFlagSet, setFlag } = useFlags()

  const round = game.currentRound
  const guesses = useMemo(
    () => game.guesses.filter((guess) => guess.round === round),
    [game.guesses, round]
  )
  const myGuess = useMemo(
    () => guesses.find((guess) => guess.playerId === myPlayerId),
    [guesses, myPlayerId]
  )
  const myPlayer = useMemo(
    () => (myPlayerId ? players[myPlayerId] : undefined),
    [players, myPlayerId]
  )

  const [pickedLocation, setPickedLocation] = useState<Coordinate>()
  const [hintShown, setHintShown] = useState(
    round === 0 && !myGuess && !isFlagSet("mapHintShown")
  )

  useEffect(() => {
    if (hintShown) {
      setFlag("mapHintShown")
      const handle = setTimeout(() => setHintShown(false), timings.defaultDelay)
      return () => clearTimeout(handle)
    }
  }, [hintShown, setFlag])

  const [alreadyGuessedShown, setAlreadyGuessedShown] = useState(false)

  useEffect(() => {
    if (alreadyGuessedShown) {
      const handle = setTimeout(
        () => setAlreadyGuessedShown(false),
        timings.defaultDelay
      )
      return () => clearTimeout(handle)
    }
  }, [alreadyGuessedShown])

  const pins = useMemo<Pin[]>(() => {
    if (!myPlayer) return []

    const location = myGuess?.location ?? pickedLocation

    if (!location) return []

    return [
      {
        type: "guess",
        location,
        confirmed: !!myGuess,
        avatarUrl: myPlayer.avatarUrl,
      },
    ]
  }, [myGuess, myPlayer, pickedLocation])

  if (!myPlayer) return null

  return (
    <Root>
      <MapContainer>
        <OLMap
          center={[0, 0]}
          zoom={0}
          pins={pins}
          onClick={(location) => {
            if (myGuess) setAlreadyGuessedShown(true)
            else setPickedLocation(location)
          }}
        />
        <SimpleCSSTransition visible={hintShown} duration={timings.default}>
          <Hint>Tap to place your guess</Hint>
        </SimpleCSSTransition>
        <SimpleCSSTransition
          visible={alreadyGuessedShown}
          duration={timings.default}
        >
          <Hint>You already guessed!</Hint>
        </SimpleCSSTransition>
        <BackButton src={backButtonImg} onClick={onBackClick} />
        <SimpleCSSTransition
          visible={!myGuess && !!pickedLocation}
          duration={timings.default}
        >
          <CTAContainer>
            <CTA
              onClick={() => {
                Rune.actions.makeGuess(pickedLocation)
              }}
            >
              Confirm Guess
            </CTA>
          </CTAContainer>
        </SimpleCSSTransition>
      </MapContainer>
      <RoundInfo />
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
`

const Hint = styled(Overlay)`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
  pointer-events: none;
`

const BackButton = styled.img`
  position: absolute;
  top: 15px;
  left: 10px;
  width: 33px;
  height: 33px;
`

const CTAContainer = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  position: absolute;
  bottom: 35px;
`

export const CTA = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #f0750b;
  border-radius: 40px;
  padding: 8px 42px;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 14px;
  }
`
