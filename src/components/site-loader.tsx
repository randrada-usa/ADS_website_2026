"use client";

import { useId, useLayoutEffect, useRef } from "react";

export function SiteLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const maskId = useId();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    // This shared layout stays mounted during navigation; a refresh mounts it anew.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const siblings = Array.from(overlay.parentElement?.children ?? []).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlay,
    );
    const previousInert = siblings.map((element) => element.inert);
    const previousOverflow = document.documentElement.style.overflow;
    siblings.forEach((element) => {
      element.inert = true;
    });
    // CSS reserves the scrollbar gutter even while the scrollbar is hidden.
    document.documentElement.style.overflow = "hidden";
    overlay.dataset.state = "visible";
    const started = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let exiting = false;
    const restore = () => {
      siblings.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      document.documentElement.style.overflow = previousOverflow;
    };
    const finish = () => {
      if (exiting) return;
      exiting = true;
      const phase = (performance.now() - started) % 4000;
      // Finish on the fully drawn logo instead of interrupting a loop midway.
      const delay = phase <= 3000 ? Math.max(0, 2600 - phase) : 6600 - phase;
      exitTimer = setTimeout(
        () => {
          overlay.dataset.state = "leaving";
          hideTimer = setTimeout(() => {
            delete overlay.dataset.state;
            restore();
          }, 900);
        },
        delay,
      );
    };
    // Do not let a slow third-party resource hold the page behind the intro.
    const deadline = setTimeout(finish, 12000);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      clearTimeout(deadline);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      window.removeEventListener("load", finish);
      delete overlay.dataset.state;
      restore();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="site-loader"
      role="status"
      aria-label="Loading Augustinian Developer Society"
    >
      <svg
        className="site-loader-logo"
        viewBox="0 0 130 108"
        aria-hidden="true"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="130"
            height="108"
          >
            <path
              className="site-loader-draw"
              d="M53 42 L3 54 L42 102 L88 5 L126 53 L77 65"
              fill="none"
              stroke="white"
              strokeWidth="16"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength="1"
            />
          </mask>
        </defs>
        <image href="/brand/ads.svg" width="130" height="108" opacity="0.08" />
        <image
          href="/brand/ads.svg"
          width="130"
          height="108"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
