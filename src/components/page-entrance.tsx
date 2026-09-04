"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const targetsSelector = [
  ".page-intro > .eyebrow",
  ".page-intro > h1",
  ".page-intro > p",
  ".page-intro > .intro-spark",
  ".featured-event",
  ".about-story > *",
  ".about-statement-cards > article",
  ".filter-row",
  ".result-count",
  ".activity-grid > *",
  ".section-heading",
  ".department-intro .page-intro-back",
  ".department-hero > div:first-child > *",
  ".department-emblem",
  ".responsibilities > .container > *",
  ".department-links > *",
].join(", ");

export function PageEntrance() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = markerRef.current?.parentElement;
    if (!root) return;
    root.dataset.pageEntrance = "true";
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {}, root);
        const animations = new Map<HTMLElement, gsap.core.Tween>();
        let ready = false;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting || !ready) return;
              observer.unobserve(entry.target);
              animations.get(entry.target as HTMLElement)?.play();
            });
          },
          { threshold: 0.08 },
        );

        context.add("scan", () => {
          root
            .querySelectorAll<HTMLElement>(targetsSelector)
            .forEach((element) => {
              if (animations.has(element) || element.closest("#team-roster"))
                return;
              element.dataset.pagePop = "true";
              const card = element.matches(
                ".activity-card, .department-card, .about-statement-cards > article",
              );
              const emblem = element.matches(".department-emblem");
              // Let the entrance own the transform, then resume the existing float.
              if (emblem) gsap.set(element, { animation: "none" });
              const artwork = element.matches(".story-art, .featured-event, .department-emblem");
              const spark = element.matches(".intro-spark");
              const compact = matchMedia("(max-width: 850px)").matches;
              const siblings = Array.from(
                element.parentElement?.children ?? [],
              );
              const index = siblings.indexOf(element);
              const columns = getComputedStyle(
                element.parentElement!,
              ).gridTemplateColumns.split(/\s+/).length;
              const rotation = Number(gsap.getProperty(element, "rotation"));
              const x = Number(gsap.getProperty(element, "x"));
              const y = Number(gsap.getProperty(element, "y"));
              const tween = gsap.fromTo(
                element,
                {
                  opacity: 0,
                  x: x + (artwork && !compact ? -24 : 0),
                  y: y + (card || artwork ? (compact ? 35 : 55) : 28),
                  scale: spark ? 0.4 : emblem ? 0.72 : card || artwork ? 0.94 : 0.98,
                  rotation:
                    rotation +
                    (emblem
                      ? -12
                      : spark
                      ? -60
                      : card
                        ? index % 2
                          ? 2
                          : -2
                        : artwork
                          ? -2
                          : 0),
                },
                {
                  opacity: 1,
                  x,
                  y,
                  scale: 1,
                  rotation,
                  duration: card || artwork ? 1.65 : 1.3,
                  delay: element.matches(".about-statement-cards > article")
                    ? 0
                    : card
                    ? (index % Math.min(columns, 4)) * 0.16
                    : spark
                      ? 0.3
                      : element.parentElement?.matches(".page-intro, .department-hero > div:first-child, .department-links, .responsibilities > .container")
                        ? Math.min(index, 4) * 0.1
                        : 0,
                  ease:
                    card || artwork || spark ? "back.out(1.15)" : "power3.out",
                  paused: true,
                  onComplete: () => {
                    gsap.set(element, { clearProps: emblem ? "opacity,transform,animation" : "opacity,transform" });
                  },
                },
              );
              animations.set(element, tween);
              if (ready) observer.observe(element);
            });
        });
        context.scan();
        // Category filtering can mount fresh cards; animate those without changing filters.
        const contentObserver = new MutationObserver(() => context.scan());
        contentObserver.observe(root, { childList: true, subtree: true });
        const loader = document.querySelector<HTMLElement>(".site-loader");
        const start = () => {
          if (loader?.dataset.state) return;
          loaderObserver?.disconnect();
          ready = true;
          animations.forEach((_, element) => observer.observe(element));
        };
        const loaderObserver = loader ? new MutationObserver(start) : null;
        if (loader)
          loaderObserver?.observe(loader, {
            attributes: true,
            attributeFilter: ["data-state"],
          });
        const frame = requestAnimationFrame(start);
        const revealFocused = (event: FocusEvent) => {
          if (!(event.target instanceof Element)) return;
          const target = event.target.closest<HTMLElement>("[data-page-pop]");
          if (target) {
            observer.unobserve(target);
            animations.get(target)?.progress(1);
          }
        };
        root.addEventListener("focusin", revealFocused);
        return () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          loaderObserver?.disconnect();
          contentObserver.disconnect();
          root.removeEventListener("focusin", revealFocused);
          animations.forEach((_, element) => {
            delete element.dataset.pagePop;
          });
          context.revert();
        };
      },
      root,
    );
    return () => {
      media.revert();
      delete root.dataset.pageEntrance;
    };
  }, []);

  return <span ref={markerRef} hidden aria-hidden="true" />;
}
