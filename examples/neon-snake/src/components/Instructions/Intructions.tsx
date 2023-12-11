import instructions from "./instructions.png"
import { styled } from "styled-components"
import { rel } from "../../lib/rel.ts"

export const Instructions = ({ faded }: { faded?: boolean }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <InstructionsImage src={instructions} $faded={faded} />
    </div>
  )
}

const InstructionsImage = styled.img<{ $faded?: boolean }>`
  width: ${rel(246.69)};
  height: ${rel(94)};
  position: absolute;
  bottom: ${rel(50)};
  opacity: ${({ $faded }) => ($faded ? 0.5 : 1)};
`
