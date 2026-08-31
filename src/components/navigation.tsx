"use client";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <Link
          href="/"
          className="brand"
          aria-label="Augustinian Developer Society home"
          onClick={() => setOpen(false)}
        >
          <Image src="/brand/ads.svg" alt="" width={130} height={108} priority />
        </Link>
        <div className="desktop-nav">
          {links.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className={path.startsWith(href) ? "active" : ""}
              aria-current={path.startsWith(href) ? "page" : undefined}
            >
              {title}
            </Link>
          ))}
        </div>
        <SocialIcons socials={socials} />
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          {[...links, ["Contact", "#contact"]].map(([title, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {title}
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
