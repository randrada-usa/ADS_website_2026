"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { BackArrowIcon } from "./icons";

interface BackButtonProps {
  href?: string;
  fallbackHref?: string;
  children?: ReactNode;
  className?: string;
}

export function BackButton({
  href,
  fallbackHref = "/",
  children = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();
  const targetHref = href || fallbackHref;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <Link
      href={targetHref}
      onClick={handleClick}
      className={`back-button ${className}`.trim()}
      aria-label={typeof children === "string" ? children : "Go back"}
    >
      <BackArrowIcon className="back-button-icon" />
      <span className="back-button-text">{children}</span>
    </Link>
  );
}
