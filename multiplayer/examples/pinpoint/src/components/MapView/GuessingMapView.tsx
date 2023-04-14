import styled from "styled-components/macro"
import { OLMap, Pin, MapRef } from "../OLMap/OLMap"
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { Coordinate } from "ol/coordinate"
import { RoundInfo } from "./RoundInfo"
import { Overlay } from "../Overlay"
import backButtonImg from "./img/backButton.svg"
import { Rune } from "../../lib/Rune"
import { useAtomValue } from "jotai"
import { $game, $myGuess, $guesses } from "../../state/game"
import { $players, $myPlayer } from "../../state/players"
import { useFlags } from "../../state/flags"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { timings } from "../animation/config"
import { Player, PlayerEvent } from "@lottiefiles/react-lottie-player"

import confettiAnimation from "./lottie/98540-celebrate.json"
import { Pixel } from "ol/pixel"
import { avatarSize } from "../OLMap/layers/guessLayer"
import { useLatestGuess } from "../PanoramaView/useLatestGuess"
import { sounds } from "../../sounds/sounds"
import { $myPlayerId } from "../../state/myPlayerId"

const confettiSize = 300

export function GuessingMapView({ onBackClick }: { onBackClick: () => void }) {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const { isFlagSet, setFlag } = useFlags()

  const round = game.currentRound
  const isSpectator = !useAtomValue($myPlayerId)
  const guesses = useAtomValue($guesses)
  const myGuess = useAtomValue($myGuess)
  const myPlayer = useAtomValue($myPlayer)

  const [pickedLocation, setPickedLocation] = useState<Coordinate>()
  const [hintShown, setHintShown] = useState(
    round === 0 && !myGuess && !isFlagSet("mapHintShown") && !isSpectator
  )

  useEffect(() => {
    if (hintShown) setFlag("mapHintShown")
  }, [hintShown, setFlag])

  const [alreadyGuessedShown, setAlreadyGuessedShown] = useState(false)

  useEffect(() => {
    if (alreadyGuessedShown) {
      const handle = setTimeout(
        () => setAlreadyGuessedShown(false),
        timings.delayShort
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

  const mapRef = useRef<MapRef>(null)
  const [confetti, setConfetti] = useState<Pixel>()

  const onMapClick = useCallback(
    (location: Coordinate) => {
      if (isSpectator) return
      setHintShown(false)
      if (myGuess) setAlreadyGuessedShown(true)
      else setPickedLocation(location)
    },
    [isSpectator, myGuess]
  )

  const lastGuessBeforeEndOfRound = useMemo(
    () => game.playerIds.length === guesses.length + 1,
    [game.playerIds.length, guesses.length]
  )

  const onConfirmClick = useCallback(() => {
    if (!pickedLocation) return

    Rune.actions.makeGuess(pickedLocation)

    setConfetti(mapRef.current?.getPixelFromCoordinate(pickedLocation))

    if (!lastGuessBeforeEndOfRound) sounds.guessSubmit.play()
  }, [lastGuessBeforeEndOfRound, pickedLocation])

  const onConfettiEvent = useCallback((e: PlayerEvent) => {
    if (e === "complete") setConfetti(undefined)
  }, [])

  const { latestGuess, latestGuessShown } = useLatestGuess()

  const onInteraction = useCallback(() => setHintShown(false), [])

  return (
    <Root>
      <MapContainer>
        <OLMap
          ref={mapRef}
          center={[0, 0]}
          zoom={0}
          pins={pins}
          onClick={onMapClick}
          onInteraction={onInteraction}
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
            <CTA onClick={onConfirmClick}>Confirm Guess</CTA>
          </CTAContainer>
        </SimpleCSSTransition>
        {confetti && (
          <Confetti
            autoplay
            keepLastFrame
            src={confettiAnimation}
            onEvent={onConfettiEvent}
            style={{
              top: confetti[1] - (confettiSize / 2) * 1.2 - avatarSize / 2,
              left: confetti[0] - confettiSize / 2,
            }}
          />
        )}
        {latestGuess && (
          <SimpleCSSTransition
            visible={latestGuessShown}
            duration={timings.default}
          >
            <LatestGuess>
              {players[latestGuess.playerId].displayName} made a guess
            </LatestGuess>
          </SimpleCSSTransition>
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
  bottom: 25px;
  // clickable padding to prevent touching the map near the button
  padding: 20px;
`

export const CTA = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #f0750b;
  border-radius: 40px;
  padding: 10px 40px;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 14px;
  }
  pointer-events: auto;
`

const Confetti = styled(Player)`
  position: absolute;
  width: ${confettiSize}px;
  height: ${confettiSize}px;
  pointer-events: none;
`

const LatestGuess = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  position: absolute;
  bottom: 7px;
  background-color: rgba(1, 164, 145, 0.8);
  border-radius: 17px;
  font-weight: 700;
  font-size: 11px;
  color: white;
  padding: 5px 10px;
`
