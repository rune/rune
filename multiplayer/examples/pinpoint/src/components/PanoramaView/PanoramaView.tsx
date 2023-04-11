import styled from "styled-components/macro"
import { PhotoSphereViewer } from "./PhotoSphereViewer"
import React, { useState, useEffect, useMemo } from "react"
import { StartOfRoundOverlay } from "./StartOfRoundOverlay"
import { PanoramaControlsHint } from "./PanoramaControlsHint"
import mapBtnImg from "./img/mapBtn.svg"
import { Overlay } from "../Overlay"
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
import { useLatestGuess } from "./useLatestGuess"

export function PanoramaView({
  onOpenMapClick,
}: {
  onOpenMapClick: () => void
}) {
  const game = useAtomValue($game)!
  const players = useAtomValue($players)!
  const myPlayerId = useAtomValue($myPlayerId)
  const { isFlagSet, setFlag } = useFlags()

  const isSpectator = !myPlayerId
  const round = game.currentRound
  const panorama = game.rounds[game.currentRound].panorama
  const guesses = useMemo(
    () => game.guesses.filter((guess) => guess.round === round),
    [game.guesses, round]
  )
  const myGuess = useMemo(
    () => guesses.find((guess) => guess.playerId === myPlayerId),
    [guesses, myPlayerId]
  )

  const [overlay, setOverlay] = useState<"startOfRound" | "hint" | null>(null)

  const shouldShowHint = useMemo(
    () => round === 0 && !isFlagSet("panoramaHintShown"),
    [isFlagSet, round]
  )

  useEffect(() => {
    if (overlay !== null || isSpectator) return

    if (!myGuess && !isFlagSet("startOfRoundShown")) {
      setOverlay("startOfRound")
    } else if (shouldShowHint) {
      setOverlay("hint")
    }
  }, [isFlagSet, isSpectator, myGuess, overlay, shouldShowHint, game.sessionId])

  useEffect(() => {
    if (overlay === "startOfRound") setFlag("startOfRoundShown")
    else if (overlay === "hint") setFlag("panoramaHintShown")
  }, [overlay, setFlag])

  useEffect(() => {
    if (overlay === "startOfRound") {
      const handle = setTimeout(
        () => setOverlay(shouldShowHint ? "hint" : null),
        timings.defaultDelay
      )
      return () => clearTimeout(handle)
    }

    if (overlay === "hint") {
      const handle = setTimeout(() => setOverlay(null), timings.defaultDelay)
      return () => clearTimeout(handle)
    }
  }, [round, overlay, shouldShowHint])

  const meLastOneLeft = useMemo(
    () =>
      !isSpectator &&
      game.playerIds.length > 1 &&
      guesses.length === game.playerIds.length - 1 &&
      !myGuess,
    [game.playerIds.length, guesses.length, isSpectator, myGuess]
  )

  const [meLastOneLeftHidden, setMeLastOneLeftHidden] = useState(false)

  useEffect(() => {
    if (meLastOneLeft) {
      setMeLastOneLeftHidden(false)
      const handle = setTimeout(
        () => setMeLastOneLeftHidden(true),
        timings.defaultDelay
      )
      return () => clearTimeout(handle)
    }
  }, [meLastOneLeft])

  const { latestGuess, latestGuessShown } = useLatestGuess()

  return (
    <Root>
      <PhotoSphereViewer baseUrl={game.panoramasUrl} panorama={panorama} />
      <StartOfRoundOverlay visible={overlay === "startOfRound"} />
      <PanoramaControlsHint visible={overlay === "hint"} />
      {!isSpectator && (
        <MapBtnContainer onClick={onOpenMapClick}>
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
          <MapBtn src={mapBtnImg} />
          {game.playerIds.length > 1 && (
            <MapBtnLabel>
              {guesses.length}/{game.playerIds.length}
            </MapBtnLabel>
          )}
        </MapBtnContainer>
      )}
      {isSpectator && (
        <LabelContainer location="top">
          <Label>You are spectating 👀</Label>
        </LabelContainer>
      )}
      <SimpleCSSTransition
        visible={meLastOneLeft && !meLastOneLeftHidden}
        duration={timings.default}
      >
        <LabelContainer location="center">
          <Label>
            You're the last one left. It's time to guess the location!&nbsp;📍
          </Label>
        </LabelContainer>
      </SimpleCSSTransition>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`
const MapBtnContainer = styled.div`
  position: absolute;
  bottom: 15px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const MapBtn = styled.img`
  width: 70px;
  height: 70px;
  z-index: 0;
`

const MapBtnLabel = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: #1e6252;
  position: absolute;
  bottom: 8px;
`

const LatestGuess = styled.div`
  ${simpleCSSTransitionStyles(
    { maxWidth: 0, opacity: 0 },
    { maxWidth: "75vw", opacity: 1 }
  )};
  position: absolute;
  right: calc(100% - 20px);
  margin-bottom: 5px;
  white-space: nowrap;
  background: rgba(248, 255, 252, 0.7);
  font-size: 11px;
  font-weight: 700;
  color: #051713;
  padding: 5px 25px 5px 10px;
  border-radius: 17px;
  z-index: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

const LabelContainer = styled(Overlay)<{ location: "top" | "center" }>`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ location }) =>
    location === "top" ? "flex-start" : "center"};
  padding: 20px 0;
  pointer-events: none;
`

const Label = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  background-color: #1e6252;
  border-radius: 65px;
  padding: 5px 40px;
  min-height: 35px;
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`
