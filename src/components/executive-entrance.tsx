"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function ExecutiveEntrance({
  children,
  id = "team-home",
  className = "team-preview section",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {}, root);
        const targets = Array.from(
          root.querySelectorAll<HTMLElement>(
            ".section-heading, .member-card, .responsive-section-action",
          ),
        );
        const cards = Array.from(root.querySelectorAll(".member-card"));
        context.add("prepare", () => {
          gsap.set(targets, { opacity: 0 });
        });
        context.prepare();
        context.add("reveal", (element: HTMLElement) => {
          const cardIndex = cards.indexOf(element);
          const compact = window.matchMedia("(max-width: 850px)").matches;
          const isCard = cardIndex >= 0;
          const sequence = gsap.timeline({
            onComplete: () => {
              gsap.set(element, {
                clearProps: "opacity,transform,transformOrigin",
              });
            },
          });
          sequence.fromTo(
            element,
            {
              y: isCard ? (compact ? 38 : 64) : 24,
              scale: isCard ? 0.93 : 1,
              rotation: isCard ? (cardIndex % 2 ? 2.5 : -2.5) : 0,
              opacity: 0,
              transformOrigin: "50% 100%",
            },
            {
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: isCard ? 1.8 : 1.3,
              delay: isCard ? (cardIndex % (compact ? 2 : 4)) * 0.2 : 0,
              ease: isCard ? "back.out(1.25)" : "power3.out",
            },
          );
        });
        // Each row reveals when it enters view, including the lower rows on phones.
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              observer.unobserve(entry.target);
              context.reveal(entry.target);
            });
          },
          { threshold: 0.12 },
        );
        // A direct visit to /team should reveal the roster after the loader.
        const loader = document.querySelector<HTMLElement>(".site-loader");
        const startObserving = () => {
          if (loader?.dataset.state) return;
          loaderObserver?.disconnect();
          targets.forEach((element) => observer.observe(element));
        };
        const loaderObserver = loader
          ? new MutationObserver(startObserving)
          : null;
        if (loader)
          loaderObserver?.observe(loader, {
            attributes: true,
            attributeFilter: ["data-state"],
          });
        const frame = requestAnimationFrame(startObserving);
        return () => {
          cancelAnimationFrame(frame);
          loaderObserver?.disconnect();
          observer.disconnect();
          context.revert();
        };
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} id={id} className={className}>
      {children}
    </section>
  );
}
