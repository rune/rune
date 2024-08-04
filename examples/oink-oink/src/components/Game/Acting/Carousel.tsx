import styled, { css } from "styled-components/macro"
import { rel } from "../../../style/rel"
import { useMemo, useState, useEffect, memo } from "react"

export const Carousel = memo(
  ({
    values,
    selected,
    big,
  }: {
    values: string[]
    selected: string
    big?: boolean
  }) => {
    const orderedValues = useMemo(() => {
      const random = [...values].sort(() => Math.random() - 0.5)

      // remove selected from the list
      random.splice(random.indexOf(selected), 1)
      // replicate the list to increase length
      random.push(...random, ...random)
      // insert selected in the middle
      random.splice(-Math.floor(values.length / 2), 0, selected)

      return random
    }, [selected, values])

    const offset = useMemo(() => {
      const margin = big ? sizes.big.margin : sizes.small.margin
      const size = big ? sizes.big.normalSize : sizes.small.normalSize
      const selectedSize = big
        ? sizes.big.selectedSize
        : sizes.small.selectedSize

      return (
        (margin + size) * orderedValues.indexOf(selected) +
        margin +
        selectedSize / 2
      )
    }, [big, orderedValues, selected])

    const [renderedOffset, setRenderedOffset] = useState(0)

    useEffect(() => {
      requestAnimationFrame(() => setRenderedOffset(offset))
    }, [offset])

    const delay = useMemo(() => Math.round(Math.random() * 200), [])

    return (
      <Root big={!!big}>
        <Inner offset={renderedOffset} delay={delay}>
          {orderedValues.map((value, i) => (
            <Img
              key={i}
              src={value}
              big={!!big}
              selected={value === selected}
            />
          ))}
        </Inner>
      </Root>
    )
  }
)

const sizes = {
  big: {
    margin: 32,
    normalSize: 96,
    selectedSize: 220,
  },
  small: {
    margin: 24,
    normalSize: 32,
    selectedSize: 64,
  },
}

const Root = styled.div<{ big: boolean }>`
  width: 100vw;
  overflow: hidden;
`

const Inner = styled.div<{ offset: number; delay: number }>`
  display: flex;
  align-items: center;
  margin-left: ${({ offset }) => `calc(${rel(-offset)} + 50%)`};
  opacity: 0;
  animation: fadeIn 200ms ease-out forwards;
  transition: margin-left 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)
    ${({ delay }) => -delay}ms;
`

const Img = styled.img<{ big: boolean; selected: boolean }>`
  ${({ big, selected }) => {
    const size = big
      ? selected
        ? sizes.big.selectedSize
        : sizes.big.normalSize
      : selected
        ? sizes.small.selectedSize
        : sizes.small.normalSize

    const margin = big ? sizes.big.margin : sizes.small.margin

    return css`
      width: ${rel(size)};
      height: ${rel(size)};
      margin-left: ${rel(margin)};
    `
  }};
`
