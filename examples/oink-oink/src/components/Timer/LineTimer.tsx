import { useTimerValue } from "./useTimerValue"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { useMemo } from "react"

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

  const clock = useMemo(() => {
    if (!value) return null
    const minutes = Math.floor(value / 60)
    const seconds = Math.round(value % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }, [value])

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
      <Clock>{clock}</Clock>
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

const Clock = styled.div`
  font-family: UbuntuMono;
  font-weight: 700;
  font-size: ${rel(20)};
`
