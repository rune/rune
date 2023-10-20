import { css } from "styled-components"
import backgroundGridCell from "../components/BoardScreen/backgroundGridCell.png"

const horizontalCellCount = 23
const cellSizePx = 17
const cellBorderPx = 0.68
const cellSizeVw = (1 / horizontalCellCount) * 100
const cellSizeWithNextBorderVw =
  cellSizeVw - ((cellSizeVw / cellSizePx) * cellBorderPx) / horizontalCellCount

export const gridBackground = css`
  background:
    url("${backgroundGridCell}") repeat left top / ${cellSizeWithNextBorderVw}vw
      ${cellSizeWithNextBorderVw}vw,
    black;
`
