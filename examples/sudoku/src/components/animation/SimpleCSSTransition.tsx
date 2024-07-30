import { ReactElement, useRef, cloneElement } from "react"
import { CSSTransition } from "react-transition-group"
import { CSSObject, css } from "styled-components/macro"

export function SimpleCSSTransition({
  visible,
  duration,
  children,
}: {
  visible: boolean
  duration: number
  children: ReactElement | ReactElement[]
}) {
  const ref = useRef(null)

  if (Array.isArray(children)) {
    return (
      <>
        {children.map((child, i) => (
          <SimpleCSSTransition
            key={i}
            visible={visible}
            duration={duration}
            children={child}
          />
        ))}
      </>
    )
  }

  return (
    <CSSTransition
      nodeRef={ref}
      in={visible}
      timeout={duration}
      mountOnEnter
      unmountOnExit
      children={cloneElement(children, { ref, animationDuration: duration })}
    />
  )
}

export function simpleCSSTransitionStyles(
  from: CSSObject,
  to: CSSObject,
  easing = "ease-out"
) {
  return css<{ animationDuration?: number }>`
    ${({ animationDuration }) => css`
      ${to};

      &.enter {
        ${from};
      }

      &.enter-active {
        ${to};
        transition: all ${animationDuration}ms ${easing};
      }

      &.exit {
        ${to};
      }

      &.exit-active {
        ${from};
        transition: all ${animationDuration}ms ${easing};
      }
    `}
  `
}
