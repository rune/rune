import { useTimerValue } from "./useTimerValue"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"

export function LineTimer({
  startedAt,
  duration,
  almostOverAt,
}: {
  startedAt?: number
  duration: number
  almostOverAt?: number
}) {
  const value = useTimerValue({ startedAt, duration })

  if (value === null) return null

  const almostOver = almostOverAt !== undefined && value <= almostOverAt

  return (
    <Root>
      <Container>
        <Value
          style={{ width: `${(value / duration) * 100}%` }}
          almostOver={almostOver}
        />
      </Container>
      <Label>00:{`${Math.round(value)}`.padStart(2, "0")}</Label>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${rel(18)};
  > :not(:first-child) {
    margin-left: ${rel(23)};
  }
`

const Container = styled.div`
  flex: 1;
  background: white;
  height: ${rel(12)};
  border-radius: ${rel(24)};
  overflow: hidden;
`

const Value = styled.div<{ almostOver: boolean }>`
  background: ${({ almostOver }) => (almostOver ? "#FFC531" : "#31ff6b")};
  height: 100%;
`

const Label = styled.div`
  font-family: UbuntuMono;
  font-weight: 700;
  font-size: ${rel(20)};
`
