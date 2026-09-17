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
      const floatingElements = document.querySelectorAll("[data-float]");
      if (!floatingElements.length) return;
      gsap.to(floatingElements, {
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
      ".section-heading",
      ".events-home-grid > *",
      ".team-grid > *",
      ".team-placeholder-grid > *",
      ".about-story > *",
      ".activity-grid > *",
      ".faq-item",
      ".empty-state",
    ];

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelectors.join(", "))
    ).filter((element) => !element.closest("#team-home, [data-page-entrance]"));

    elements.forEach((el) => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
      }
    });

    const departmentGrids = Array.from(
      document.querySelectorAll<HTMLElement>(".departments-grid")
    );

    departmentGrids.forEach((grid) => {
      Array.from(grid.children).forEach((card) => {
        card.setAttribute("data-reveal", "");
      });
    });

    const resetFrames: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isDepartmentGrid = entry.target.matches(".departments-grid");
          const revealTargets = isDepartmentGrid
            ? Array.from(entry.target.children)
            : [entry.target];

          if (entry.isIntersecting) {
            if (isDepartmentGrid) {
              entry.target.setAttribute(
                "data-reveal-direction",
                entry.boundingClientRect.top < 0 ? "reverse" : "forward"
              );
            }

            revealTargets.forEach((target) => {
              target.setAttribute("data-revealed", "true");
              target.classList.add("is-revealed");
            });
          } else {
            if (isDepartmentGrid) {
              entry.target.setAttribute("data-reveal-resetting", "true");
            }

            revealTargets.forEach((target) => {
              if (target.matches(".faq-item")) return;
              target.removeAttribute("data-revealed");
              target.classList.remove("is-revealed");
            });

            if (isDepartmentGrid) {
              const firstFrame = window.requestAnimationFrame(() => {
                const secondFrame = window.requestAnimationFrame(() => {
                  entry.target.removeAttribute("data-reveal-resetting");
                });
                resetFrames.push(secondFrame);
              });
              resetFrames.push(firstFrame);
            }
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
    departmentGrids.forEach((grid) => observer.observe(grid));

    return () => {
      media.revert();
      observer.disconnect();
      resetFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    };
  }, [pathname]);

  return null;
}
