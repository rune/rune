import React from "react"
import clsx from "clsx"
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal"
import { Social } from "../../../../components/Social"

export default function ({ header, primaryMenu, secondaryMenu }) {
  const { shown: secondaryMenuShown, hide } = useNavbarSecondaryMenu()

  return (
    <div className="navbar-sidebar">
      {header}
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">
          {primaryMenu}

          <div className="navbar-sidebar__footer">
            <Social/>
          </div>

        </div>
        <div className="navbar-sidebar__item menu">
          <div className="menu__list-item" style={{
            textAlign: 'center',
            marginBottom: '20px',
            paddingLeft: 0,
            cursor: "pointer",
            lineHeight: '100%',
          }}>
            <div className="menu__link" onClick={hide}>
              <img
                alt="back"
                 style={{marginRight: '14px'}}
                src={require("!!url-loader!!@site/static/img/sidebar-back.svg").default}
              />
              Back
            </div>
          </div>

          {secondaryMenu}

          <div className="navbar-sidebar__footer">
            <Social/>
          </div>
        </div>
      </div>
    </div>
  )
}
