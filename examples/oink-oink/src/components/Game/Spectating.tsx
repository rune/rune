import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { $actorPlayer } from "../../state/$state"
import { useAtomValue } from "jotai"
import { RisingGuessesView } from "./Acting/RisingGuessesView"
import { memo } from "react"

export const Spectating = memo(() => {
  const actorPlayer = useAtomValue($actorPlayer)

  return (
    <Root>
      <Player>
        <AvatarImg src={actorPlayer?.info.avatarUrl} />
        <Label>
          {actorPlayer?.info.displayName}
          <br />
          is acting
        </Label>
      </Player>
      <Bottom>
        <Label>Guesses</Label>
        <RisingGuessesView />
      </Bottom>
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Player = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: ${rel(15)};
  }
`

const AvatarImg = styled.img`
  width: ${rel(60)};
  height: ${rel(60)};
`

const Label = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-align: center;
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  padding-bottom: ${rel(100)};
`
