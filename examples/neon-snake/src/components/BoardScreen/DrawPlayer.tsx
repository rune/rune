import { GameStage, PlayerInfo, Snake } from "../../logic/types.ts"
import { Container, Graphics, Sprite } from "@pixi/react"
import { DrawSection } from "./DrawSection.tsx"
import { DrawArrow } from "./DrawArrow.tsx"
import { DrawDeadEnd } from "./DrawDeadEnd.tsx"
import { useCallback, useMemo } from "react"
import { getOptimisticStartSection } from "./getOptimisticStartSection.ts"
import { Graphics as PixiGraphics } from "@pixi/graphics"
import { avatarRadius } from "./drawConfig.ts"
import { DrawLoops } from "./DrawLoops.tsx"

function DrawOptimistic({
  color,
  scale,
  isOpponent,
  snake,
  avatar,
  timerStartedAt,
}: {
  snake: Snake
  color: string
  scale: number
  isOpponent: boolean
  avatar: string
  timerStartedAt: number
}) {
  const optimisticSection = useMemo(() => {
    return getOptimisticStartSection(snake)
  }, [snake])

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear()

      g.beginFill(color, 1)
      g.drawCircle(0, 0, avatarRadius * scale)

      g.endFill()
    },
    [color, scale],
  )

  return (
    <>
      <DrawSection
        section={optimisticSection}
        color={color}
        scale={scale}
        isOpponent={isOpponent}
      />
      <DrawArrow
        point={optimisticSection.end}
        angle={optimisticSection.endAngle}
        color={color}
        scale={scale}
      />
      <Container
        x={optimisticSection.start.x * scale}
        y={optimisticSection.start.y * scale}
      >
        {!isOpponent && (
          <DrawLoops
            color={color}
            scale={scale}
            timerStartedAt={timerStartedAt}
          />
        )}
        <Graphics draw={draw} />
        <Sprite
          image={avatar}
          width={(avatarRadius - 1) * 2 * scale}
          height={(avatarRadius - 1) * 2 * scale}
          anchor={0.5}
        />
      </Container>
    </>
  )
}

export function DrawPlayer({
  stage,
  player,
  snake,
  scale,
  isOpponent,
  avatar,
  timerStartedAt,
}: {
  stage: GameStage
  player: PlayerInfo
  snake: Snake
  scale: number
  isOpponent: boolean
  avatar: string
  timerStartedAt: number
}) {
  const latestSection = snake.sections.at(-1)

  if (!player || player.state === "pending") {
    return
  }

  return (
    <Container>
      {stage === "countdown" ? (
        <DrawOptimistic
          scale={scale}
          snake={snake}
          avatar={avatar}
          isOpponent={isOpponent}
          color={player.color}
          timerStartedAt={timerStartedAt}
        />
      ) : (
        <>
          {snake.sections.map((section, index) =>
            section.gap ? null : (
              <DrawSection
                section={section}
                color={player.color}
                key={index}
                scale={scale}
                isOpponent={isOpponent}
              />
            ),
          )}
          {!latestSection ? null : player.state === "alive" ? (
            <DrawArrow
              point={latestSection.end}
              angle={latestSection.endAngle}
              color={player.color}
              scale={scale}
            />
          ) : (
            <DrawDeadEnd
              point={latestSection.end}
              diedAt={player.diedAt}
              color={player.color}
              scale={scale}
            />
          )}
        </>
      )}
    </Container>
  )
}
