"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Arrow } from "./icons";
import { SocialIcons } from "./social-icons";
import type { SiteSettings } from "@/lib/types";
const links = [
  ["About", "/about"],
  ["Initiatives", "/initiatives"],
  ["Events", "/events"],
  ["Team", "/team"],
];

export function Navigation({ socials }: { socials: SiteSettings["socials"] }) {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const scrollPageToTop = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  useEffect(() => {
    if (!open) return;
    const scrollPosition = window.scrollY;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnPageScroll = () => {
      if (window.scrollY !== scrollPosition) {
        setOpen(false);
      }
    };
    const closeOnOutsideScrollIntent = (event: Event) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress, true);
    document.addEventListener("focusin", closeOnOutsideFocus);
    window.addEventListener("scroll", closeOnPageScroll, { passive: true });
    window.addEventListener("wheel", closeOnOutsideScrollIntent, {
      passive: true,
    });
    window.addEventListener("touchmove", closeOnOutsideScrollIntent, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress, true);
      document.removeEventListener("focusin", closeOnOutsideFocus);
      window.removeEventListener("scroll", closeOnPageScroll);
      window.removeEventListener("wheel", closeOnOutsideScrollIntent);
      window.removeEventListener("touchmove", closeOnOutsideScrollIntent);
    };
  }, [open]);

  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      sessionStorage.setItem("ads_last_scroll_home", window.scrollY.toString());
    }
    setOpen(false);
  };

  const handleBrandClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ads_last_scroll_home");
    }
    setOpen(false);
    scrollPageToTop();
  };

  return (
    <header className={`site-header${open ? " is-menu-open" : ""}`}>
      <nav ref={navRef} className="nav-shell" aria-label="Main navigation">
        <Link
          href="/"
          className="brand"
          aria-label="Augustinian Developer Society home"
          onClick={handleBrandClick}
        >
          <Image
            src="/brand/ads.svg"
            alt=""
            width={130}
            height={108}
            priority
          />
        </Link>
        <div className="desktop-nav">
          {links.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className={path.startsWith(href) ? "active" : ""}
              aria-current={path.startsWith(href) ? "page" : undefined}
              onClick={handleNavClick}
            >
              {title}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <SocialIcons socials={socials} />
          <button
            id="menu-toggle"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
        <div
          id="mobile-menu"
          className="mobile-menu"
          aria-hidden={!open}
          inert={!open}
        >
          <div className="mobile-menu-clip">
            <div className="mobile-menu-content">
              {[...links, ["Contact", "#contact"]].map(([title, href]) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                  onClick={href.startsWith("/") ? handleNavClick : () => setOpen(false)}
                >
                  {title}
                  <Arrow diagonal />
                </Link>
              ))}
              <div className="mobile-socials">
                <SocialIcons socials={socials} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
