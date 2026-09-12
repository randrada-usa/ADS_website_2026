"use client";

import Link from "next/link";
import type { ReactNode } from "react";
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
  const targetHref = href || fallbackHref;

  return (
    <Link
      href={targetHref}
      className={`back-button ${className}`.trim()}
      aria-label={typeof children === "string" ? children : "Go back"}
    >
      <BackArrowIcon className="back-button-icon" />
      <span className="back-button-text">{children}</span>
    </Link>
  );
}
