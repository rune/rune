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
      const handle = setTimeout(() => setHintShown(false), 2000)
      return () => clearTimeout(handle)
    }
  }, [hintShown, setFlag])

  const [myGuessShown, setMyGuessShown] = useState(false)

  useEffect(() => {
    if (myGuess) {
      setMyGuessShown(true)
      const handle = setTimeout(() => setMyGuessShown(false), 2000)
      return () => clearTimeout(handle)
    }
  }, [myGuess])

  const pins = useMemo<Pin[]>(() => {
    if (!myPlayer) return []

    const location = myGuess?.location ?? pickedLocation

    if (!location) return []

    return [{ type: "guess", location, avatarUrl: myPlayer.avatarUrl }]
  }, [myGuess, myPlayer, pickedLocation])

  const myGuessLocationShifted = useMemo(() => {
    if (!myGuess) return null
    const [x, y] = myGuess.location
    return [x, y + 0.07]
  }, [myGuess])

  if (!myPlayer) return null

  return (
    <Root>
      <MapContainer>
        <OLMap
          center={myGuessLocationShifted ?? [0, 0]}
          zoom={myGuess ? 10 : 0}
          pins={pins}
          onClick={
            myGuess ? undefined : (location) => setPickedLocation(location)
          }
        />
        {hintShown && (
          <>
            <DarkBackground />
            <Hint>Tap to place your guess</Hint>
          </>
        )}
        {myGuessShown && (
          <>
            <DarkBackground />
            <Hint>You already guessed!</Hint>
          </>
        )}
        <BackButton src={backButtonImg} onClick={onBackClick} />
        {!myGuess && pickedLocation && (
          <CTAContainer>
            <CTA
              onClick={() => {
                Rune.actions.makeGuess(pickedLocation)
                onBackClick()
              }}
            >
              Confirm Guess
            </CTA>
          </CTAContainer>
        )}
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

const DarkBackground = styled(Overlay)`
  background-color: black;
  opacity: 0.5;
  pointer-events: none;
`

const Hint = styled(Overlay)`
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
