"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { BackArrowIcon } from "./icons";

interface BackButtonProps {
  fallbackHref?: string;
  children?: ReactNode;
  className?: string;
}

export function BackButton({
  fallbackHref = "/",
  children = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      className={`back-button ${className}`.trim()}
      aria-label={typeof children === "string" ? children : "Go back"}
    >
      <BackArrowIcon className="back-button-icon" />
      <span className="back-button-text">{children}</span>
    </Link>
  );
}
