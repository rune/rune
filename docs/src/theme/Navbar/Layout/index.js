import React, { useState, useEffect } from "react"
import clsx from "clsx"
import { useThemeConfig } from "@docusaurus/theme-common"
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal"
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar"
import styles from "./styles.module.scss"
import Link from "@docusaurus/Link"
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle"
import { useLocation } from "@docusaurus/router"
import SearchBar from "@cmfcmf/docusaurus-search-local/lib/client/theme/SearchBar"

function NavbarBackdrop(props) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx("navbar-sidebar__backdrop", props.className)}
    />
  )
}
export default function NavbarLayout() {
  const location = useLocation()

  const [scrolledFromTop, setScrolledFromTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolledFromTop(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const {
    navbar: { hideOnScroll, style },
  } = useThemeConfig()
  const mobileSidebar = useNavbarMobileSidebar()
  const { navbarRef } = useHideableNavbar(hideOnScroll)

  return (
    <div
      ref={navbarRef}
      className={clsx(
        "navbar",
        "navbar--fixed-top",
        { "navbar-sidebar--show": mobileSidebar.shown },
        styles.header,
        scrolledFromTop && styles.scrolledFromTop,
        { [styles.homeNavbar]: location.pathname === "/" }
      )}
    >
      <div className={styles.left}>
        <Link to="https://www.rune.ai">
          <img
            alt="Rune Logo"
            className={styles.logo}
            src={require("@site/static/img/home/logo.png").default}
          />
        </Link>
      </div>
      <div className={styles.right}>
        <Link
          to="/docs/quick-start"
          className={clsx(styles.menuLink, {
            [styles.active]: location.pathname.startsWith("/docs/"),
          })}
        >
          Docs
        </Link>
        <Link
          to="/faq"
          className={clsx(styles.menuLink, {
            [styles.active]: location.pathname === "/faq",
          })}
        >
          FAQ
        </Link>
        <a
          href="https://github.com/rune/rune"
          target="_blank"
          rel="noreferrer"
          className={styles.menuBtn}
        >
          <div className={styles.normal}>GitHub</div>
          <div className={styles.hover}>GitHub</div>
        </a>
      </div>
      <div className={clsx(styles.right, styles.rightMobile)}>
        {location.pathname !== "/" && <SearchBar />}
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
      </div>
      <NavbarBackdrop onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
    </div>
  )
}
