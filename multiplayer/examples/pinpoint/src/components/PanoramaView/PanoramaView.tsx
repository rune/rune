import styled from "styled-components/macro"
import { PhotoSphereViewer } from "./PhotoSphereViewer"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { StartOfRoundOverlay } from "./StartOfRoundOverlay"
import { PanoramaControlsHint } from "./PanoramaControlsHint"
import mapBtnImg from "./img/mapBtn.svg"
import { Overlay } from "../Overlay"
import { useAtomValue } from "jotai"
import { $game, $myGuess, $guesses } from "../../state/game"
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
  const guesses = useAtomValue($guesses)
  const myGuess = useAtomValue($myGuess)

  const [overlay, setOverlay] = useState<"startOfRound" | "hint" | null>(null)

  const shouldShowHint = useMemo(
    () => round === 0 && !isFlagSet("panoramaHintShown"),
    [isFlagSet, round]
  )

  useEffect(() => {
    if (!isFlagSet("startOfRoundShown")) setOverlay("startOfRound")
  }, [round, game.sessionId, isFlagSet])

  useEffect(() => {
    if (overlay === "startOfRound") {
      const handle = setTimeout(() => setOverlay(null), timings.delayLong)
      return () => clearTimeout(handle)
    }
  }, [overlay, game.sessionId])

  useEffect(() => {
    if (!overlay && isFlagSet("startOfRoundShown") && shouldShowHint) {
      setOverlay("hint")
    }
  }, [isFlagSet, overlay, shouldShowHint])

  useEffect(() => {
    if (overlay === "startOfRound") setFlag("startOfRoundShown")
    else if (overlay === "hint") setFlag("panoramaHintShown")
  }, [overlay, setFlag])

  const meLastOneLeft = useMemo(
    () =>
      !isSpectator &&
      game.playerIds.length > 1 &&
      guesses.length === game.playerIds.length - 1 &&
      !myGuess,
    [game.playerIds.length, guesses.length, isSpectator, myGuess]
  )

  const { latestGuess, latestGuessShown } = useLatestGuess()

  const onFirstInteraction = useCallback(() => {
    setOverlay((overlay) => (overlay === "hint" ? null : overlay))
  }, [])

  return (
    <Root>
      <PhotoSphereViewer
        baseUrl={game.panoramasUrl}
        panorama={panorama}
        onFirstInteraction={onFirstInteraction}
      />
      <StartOfRoundOverlay visible={overlay === "startOfRound"} />
      <PanoramaControlsHint visible={overlay === "hint"} />
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
      {isSpectator && (
        <LabelContainer>
          <Label>You are spectating&nbsp;👀</Label>
        </LabelContainer>
      )}
      <SimpleCSSTransition visible={meLastOneLeft} duration={timings.default}>
        <LabelContainer>
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
  width: 24vw;
  height: 24vw;
  z-index: 0;
`

const MapBtnLabel = styled.div`
  font-size: 2.2vw;
  line-height: 2.2vw;
  bottom: 5vw;
  font-weight: 700;
  color: #1e6252;
  position: absolute;
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

const LabelContainer = styled(Overlay)`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
