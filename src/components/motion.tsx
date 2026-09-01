"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export function AmbientMotion() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Floating ambient elements
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to("[data-float]", {
        y: -9,
        rotation: "+=2",
        duration: 3.4,
        ease: "sine.inOut",
        stagger: 0.5,
        repeat: -1,
        yoyo: true,
      });
    });

    // 2. Scroll-triggered slow fade-in animations
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return () => media.revert();
    }

    document.documentElement.classList.add("js-motion-ready");

    const revealSelectors = [
      "[data-reveal]",
      ".about-image-wrap",
      ".about-copy",
      ".values-cards > article",
      ".journey-header",
      ".journey-item",
      ".initiative-showcase",
      ".section-heading",
      ".events-home-grid > *",
      ".team-grid > *",
      ".team-placeholder-grid > *",
      ".about-story > *",
      ".activity-grid > *",
      ".faq-list",
      ".empty-state",
    ];

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelectors.join(", "))
    );

    elements.forEach((el) => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            entry.target.classList.add("is-revealed");
          } else {
            entry.target.removeAttribute("data-revealed");
            entry.target.classList.remove("is-revealed");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      media.revert();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
