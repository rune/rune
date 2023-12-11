import React from "react"
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal"
import { translate } from "@docusaurus/Translate"
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle"
import styles from "../../Layout/styles.module.scss"
import Link from "@docusaurus/Link"

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar()
  return (
    <button
      type="button"
      aria-label={translate({
        id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
        message: "Close navigation bar",
        description: "The ARIA label for close button of mobile sidebar",
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}
    >
      <img
        alt="close"
        src={require("!!url-loader!!@site/static/img/close.svg").default}
      />
    </button>
  )
}

export default function NavbarMobileSidebarHeader() {
  return (
    <div className="navbar-sidebar__brand">
      <Link to="/">
        <img
          alt="Rune Logo"
          className={styles.logo}
          src={require("@site/static/img/home/logo.png").default}
        />
      </Link>
      <NavbarColorModeToggle className="margin-right--md" />
      <CloseButton />
    </div>
  )
}
