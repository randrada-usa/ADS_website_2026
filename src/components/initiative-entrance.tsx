"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function InitiativeEntrance({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !root.querySelector(".initiative-showcase")) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        root.dataset.entrance = "pending";
        let sequence: gsap.core.Timeline | undefined;
        const context = gsap.context(() => {}, root);
        const select = gsap.utils.selector(root);
        context.add("reveal", () => {
          delete root.dataset.entrance;
          const compact = window.matchMedia("(max-width: 850px)").matches;
          const badge = select(".section-boundary-label > *");
          const photos = select(".initiative-showcase-media");
          const heading = select(".initiative-showcase-copy h3");
          const summary = select(".initiative-showcase-copy > p");
          const controls = select(".initiative-showcase-controls");
          const targets = [
            ...badge,
            ...photos,
            ...heading,
            ...summary,
            ...controls,
          ];
          sequence = gsap.timeline({
            defaults: { duration: 1, ease: "power3.out" },
            onComplete: () => {
              // Restore the original stacking context before normal card interaction.
              gsap.set(targets, {
                clearProps: "transform,transformOrigin,opacity",
              });
            },
          });
          sequence
            .from(
              badge,
              {
                y: 15,
                scale: 0.86,
                rotation: -3,
                opacity: 0,
                duration: 0.85,
                ease: "back.out(1.6)",
              },
              0,
            )
            .from(
              photos,
              {
                x: compact ? 0 : 55,
                y: compact ? 45 : 70,
                rotation: compact ? 4 : 7,
                scale: 0.88,
                opacity: 0,
                transformOrigin: "50% 65%",
                duration: 1.45,
                ease: "back.out(1.2)",
              },
              0.12,
            )
            .from(
              heading,
              {
                x: compact ? 0 : -30,
                y: 30,
                rotation: compact ? 0 : -2,
                opacity: 0,
                duration: 1.1,
                ease: "back.out(1.15)",
              },
              0.32,
            )
            .from(summary, { y: 22, opacity: 0 }, 0.5)
            .from(
              controls,
              {
                y: 18,
                scale: 0.94,
                opacity: 0,
                transformOrigin: compact ? "50% 50%" : "0% 50%",
                ease: "back.out(1.5)",
                duration: 0.9,
              },
              0.66,
            );
        });
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            context.reveal();
          },
          { threshold: 0.12 },
        );
        observer.observe(root.querySelector(".initiative-showcase")!);
        const finishEntrance = () => {
          sequence?.progress(1);
        };
        root.addEventListener("pointerdown", finishEntrance, true);
        root.addEventListener("focusin", finishEntrance);
        return () => {
          observer.disconnect();
          root.removeEventListener("pointerdown", finishEntrance, true);
          root.removeEventListener("focusin", finishEntrance);
          delete root.dataset.entrance;
          context.revert();
        };
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="initiatives-home"
      className="section container initiative-home-section"
    >
      <div className="initiative-background-circles" aria-hidden="true">
        <span className="initiative-circle initiative-circle-left" />
        <span className="initiative-circle initiative-circle-middle" />
        <span className="initiative-circle initiative-circle-right" />
      </div>
      {children}
    </section>
  );
}
