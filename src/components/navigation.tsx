"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Arrow } from "./icons";
import { SocialIcons } from "./social-icons";
import type { SiteSettings } from "@/lib/types";
const links = [
  ["About", "/about"],
  ["Initiatives", "/initiatives"],
  ["Team", "/team"],
];

const homeSections = [
  ["About Us", "/#about-home"],
  ["Our Journey", "/#our-journey"],
  ["Initiatives", "/#initiatives-home"],
  ["Events", "/#events-home"],
  ["Team", "/#team-home"],
  ["Departments", "/#departments"],
  ["FAQ", "/#faq"],
];

function DownChevron() {
  return (
    <svg
      className="home-chevron"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function Navigation({ socials }: { socials: SiteSettings["socials"] }) {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [activeHomeSection, setActiveHomeSection] = useState<string | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);
  const scrollPageToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  useEffect(() => {
    if (path !== "/") return;

    let animationFrame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const activationLine = Math.min(window.innerHeight * 0.3, 240);
        let currentSection: string | null = null;

        for (const [, href] of homeSections) {
          const sectionId = href.split("#")[1];
          const section = document.getElementById(sectionId);

          if (section && section.getBoundingClientRect().top <= activationLine) {
            currentSection = href;
          } else {
            break;
          }
        }

        setActiveHomeSection((current) =>
          current === currentSection ? current : currentSection,
        );
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [path]);

  useEffect(() => {
    if (!open && !homeOpen) return;
    const scrollPosition = window.scrollY;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const focusTarget = homeOpen ? "desktop-home-toggle" : "menu-toggle";
        setOpen(false);
        setHomeOpen(false);
        document.getElementById(focusTarget)?.focus();
      }
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHomeOpen(false);
      }
    };
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHomeOpen(false);
      }
    };
    const closeOnPageScroll = () => {
      if (window.scrollY !== scrollPosition) {
        setOpen(false);
        setHomeOpen(false);
      }
    };
    const closeOnOutsideScrollIntent = (event: Event) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHomeOpen(false);
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
  }, [open, homeOpen]);

  const handleNavClick = () => {
    sessionStorage.removeItem("ads_last_scroll_home");
    setOpen(false);
    setHomeOpen(false);
    scrollPageToTop();
  };

  const handleHomeSectionClick = (href: string) => {
    sessionStorage.removeItem("ads_last_scroll_home");
    setActiveHomeSection(href);
    setOpen(false);
    setHomeOpen(false);
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ads_last_scroll_home");
    }
    setOpen(false);
    setHomeOpen(false);

    const isNormalClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (path === "/" && isNormalClick) {
      event.preventDefault();
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      return;
    }

    if (path !== "/") scrollPageToTop();
  };

  return (
    <header className={`site-header${open ? " is-menu-open" : ""}`}>
      <nav ref={navRef} className="nav-shell" aria-label="Main navigation">
        <Link
          href="/"
          className="brand"
          aria-label="Augustinian Developer Society home"
          scroll={false}
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
          <div
            className={`desktop-home-item${homeOpen ? " is-open" : ""}`}
            onMouseEnter={() => setHomeOpen(true)}
            onMouseLeave={() => setHomeOpen(false)}
          >
            <button
              id="desktop-home-toggle"
              className={`desktop-home-trigger${path === "/" ? " active" : ""}`}
              type="button"
              aria-expanded={homeOpen}
              aria-controls="desktop-home-panel"
              onClick={() => setHomeOpen((current) => !current)}
            >
              <span>Home</span>
              <DownChevron />
            </button>
            <div
              id="desktop-home-panel"
              className="desktop-home-panel"
              aria-hidden={!homeOpen}
              inert={!homeOpen}
            >
              <div className="desktop-home-panel-inner">
                {homeSections.map(([title, href]) => {
                  const isActive = path === "/" && activeHomeSection === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => handleHomeSectionClick(href)}
                    >
                      {title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {links.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              scroll={false}
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
            onClick={() => {
              setOpen((current) => !current);
              setHomeOpen(false);
            }}
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
              <div className={`mobile-home${homeOpen ? " is-open" : ""}`}>
                <button
                  className={`mobile-home-trigger${path === "/" ? " active" : ""}`}
                  type="button"
                  aria-expanded={homeOpen}
                  aria-controls="mobile-home-panel"
                  onClick={() => setHomeOpen((current) => !current)}
                >
                  <span>Home</span>
                  <DownChevron />
                </button>
                <div
                  id="mobile-home-panel"
                  className="mobile-home-panel"
                  aria-hidden={!homeOpen}
                  inert={!homeOpen}
                >
                  <div className="mobile-home-list">
                    {homeSections.map(([title, href]) => {
                      const isActive =
                        path === "/" && activeHomeSection === href;

                      return (
                        <Link
                          key={href}
                          href={href}
                          aria-current={isActive ? "location" : undefined}
                          onClick={() => handleHomeSectionClick(href)}
                        >
                          {title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              {links.map(([title, href]) => (
                <Link
                  key={href}
                  href={href}
                  scroll={false}
                  aria-current={path === href ? "page" : undefined}
                  onClick={handleNavClick}
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
