import React from "react"
import clsx from "clsx"
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal"
import { Social } from "../../../../components/Social"

export default function ({ header, primaryMenu, secondaryMenu }) {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
  return (
    <div className="navbar-sidebar">
      {header}
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
      <div className="navbar-sidebar__footer">
        <Social />
      </div>
    </div>
  )
}
