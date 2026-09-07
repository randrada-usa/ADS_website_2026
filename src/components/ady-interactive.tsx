"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface AdyInteractiveProps {
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}

export function AdyInteractive({
  className = "",
  src = "/assets/addy/addy-wave.png",
  alt = "Ady, the ADS mascot, waving",
  width = 1440,
  height = 1440,
  sizes = "(max-width: 850px) 78vw, 36vw",
  loading = "eager",
  priority,
}: AdyInteractiveProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  const isOpen = isHovered || (manualOpen !== null ? manualOpen : isAutoOpen);

  // Auto-cycle: pops for 3 seconds, gone for 5 seconds (continuous loop)
  useEffect(() => {
    // If the user is hovering or manually interacting, pause the auto timer
    if (isHovered || manualOpen !== null) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (isAutoOpen) {
      // Visible for 3 seconds
      timer = setTimeout(() => {
        setIsAutoOpen(false);
      }, 3000);
    } else {
      // Gone for 5 seconds (2 seconds on initial page arrival)
      const goneDuration = hasMounted.current ? 5000 : 2000;
      hasMounted.current = true;

      timer = setTimeout(() => {
        setIsAutoOpen(true);
      }, goneDuration);
    }

    return () => clearTimeout(timer);
  }, [isAutoOpen, isHovered, manualOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setManualOpen((prev) => (prev ? false : true));
    } else if (e.key === "Escape") {
      setManualOpen(false);
      setIsAutoOpen(false);
    }
  }, []);

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setManualOpen(false);
        setIsAutoOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setManualOpen(null);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ady-interactive-container ${className} ${isOpen ? "is-active" : ""}`}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label="Ady, ADS Mascot. Hover or press to hear Ady speak."
      onMouseEnter={() => {
        setIsHovered(true);
        setManualOpen(null);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setManualOpen(null);
        setIsAutoOpen(false);
      }}
      onFocus={() => {
        setIsHovered(true);
        setManualOpen(null);
      }}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsHovered(false);
          setManualOpen(null);
          setIsAutoOpen(false);
        }
      }}
      onClick={() => {
        setManualOpen((prev) => (prev ? false : true));
      }}
      onKeyDown={handleKeyDown}
    >
      <Image
        className="ady-mascot-img"
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        priority={priority}
      />

      <div
        className={`ady-speech-bubble ${isOpen ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="ady-bubble-content">
          <p className="ady-bubble-text">
            <span className="ady-bubble-heading">
              Hi, I&apos;m Addy!
            </span>
            <span className="ady-bubble-body">
              I&apos;m inspired by &lsquo;rubber duck debugging&rsquo;&mdash;the programmer&apos;s best friend.
            </span>
          </p>
        </div>
        <svg
          className="ady-bubble-tail"
          width="44"
          height="38"
          viewBox="0 0 44 38"
          fill="none"
          aria-hidden="true"
        >
          {/* Hard offset shadow matching bubble box-shadow */}
          <path
            d="M 6 8 C 18 13, 32 24, 42 34 C 29 31, 16 30, 6 30 Z"
            fill="var(--ink, #14181b)"
          />
          {/* Main bubble tail pointing down-right towards Ady's beak */}
          <path
            d="M 2 4 C 14 9, 28 20, 38 30 C 25 27, 12 26, 2 26 Z"
            fill="#ffffff"
            stroke="var(--ink, #14181b)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Seamless bridge covering bubble right border */}
          <line x1="2" y1="3" x2="2" y2="27" stroke="#ffffff" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}
