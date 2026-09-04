"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function DepartmentMemberScroll({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous" | null>(null);
  const profiles = Children.toArray(children);

  useLayoutEffect(() => {
    const panel = root.current;
    const windowElement = viewport.current;
    const rail = track.current;
    if (!panel || !windowElement || !rail) return;

    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 851px) and (min-height: 700px)",
        motion: "(prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 850px)",
      },
      (context) => {
        if (!context.conditions?.motion || context.conditions.mobile) return;
        const slides = Array.from(
          rail.querySelectorAll<HTMLElement>(".department-member-slide"),
        );
        const motions = slides.map((slide) =>
          slide.querySelector<HTMLElement>(".department-member-motion")!,
        );
        gsap.set(motions, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          transformOrigin: "center center",
        });
        const setters = motions.map((element) => ({
          x: gsap.quickSetter(element, "x", "px"),
          y: gsap.quickSetter(element, "y", "px"),
          opacity: gsap.quickSetter(element, "opacity"),
          rotation: gsap.quickSetter(element, "rotation", "deg"),
        }));
        let positions: { left: number; width: number }[] = [];
        let visibleWidth = 0;
        let viewportLeft = 0;
        const measure = () => {
          viewportLeft = windowElement.getBoundingClientRect().left;
          visibleWidth = Math.min(
            windowElement.clientWidth,
            document.documentElement.clientWidth -
              windowElement.getBoundingClientRect().left,
          );
          positions = slides.map((slide) => ({
            left: slide.offsetLeft,
            width: slide.offsetWidth,
          }));
        };
        const render = () => {
          const travel =
            windowElement.scrollLeft - Number(gsap.getProperty(rail, "x"));
          positions.forEach(({ left, width }, index) => {
            const currentLeft = left - travel;
            const exiting = gsap.utils.clamp(
              0,
              1,
              (24 - currentLeft - viewportLeft) / (width * 0.8),
            );
            // Keep partial cards hidden initially, then reveal near the screen edge.
            const entranceStart = Math.max(
              0,
              left - visibleWidth + width * 0.2,
            );
            const entering =
              left + width <= visibleWidth
                ? 0
                : 1 -
                  gsap.utils.clamp(
                    0,
                    1,
                    (travel - entranceStart) / (width * 0.35),
                  );
            const fade = Math.max(entering, exiting);
            setters[index].opacity(1 - fade * fade * (3 - 2 * fade));
            setters[index].x((entering - exiting) * 32);
            setters[index].y((entering - exiting) * 64);
            setters[index].rotation((entering - exiting) * 9);
          });
        };
        const refresh = () => {
          measure();
          render();
        };
        refresh();
        windowElement.addEventListener("scroll", render, { passive: true });
        window.addEventListener("resize", refresh);
        const distance = () =>
          Math.max(0, rail.scrollWidth - windowElement.clientWidth);
        if (context.conditions.desktop && distance() > 0) {
          windowElement.scrollLeft = 0;
          gsap.set(windowElement, { overflowX: "clip" });
          gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger: panel,
              start: () => {
                const headerHeight =
                  document
                    .querySelector(".site-header")
                    ?.getBoundingClientRect().height ?? 80;
                const centeredTop =
                  (window.innerHeight + headerHeight - panel.offsetHeight) / 2;
                return `top ${Math.max(headerHeight + 24, centeredTop)}px`;
              },
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.35,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onRefresh: refresh,
            },
          });
        }
        return () => {
          windowElement.removeEventListener("scroll", render);
          window.removeEventListener("resize", refresh);
        };
      },
    );
    return () => media.revert();
  }, [children]);

  return (
    <div
      ref={root}
      className="department-member-scroll"
      data-slide-direction={direction}
    >
      {heading}
      <div
        ref={viewport}
        className="department-member-viewport"
        tabIndex={0}
        role="region"
        aria-label="Department members"
      >
        <div ref={track} className="department-member-track">
          {profiles.map((profile, index) =>
            isValidElement<{ "data-active"?: boolean }>(profile)
              ? cloneElement(profile, { "data-active": index === active })
              : profile,
          )}
        </div>
      </div>
      <div className="department-member-controls">
        <button
          type="button"
          aria-label="Previous member"
          disabled={active === 0}
          onClick={() => {
            setDirection("previous");
            setActive((index) => Math.max(0, index - 1));
          }}
        >
          &lt;
        </button>
        <span role="status" aria-live="polite">
          {active + 1} / {profiles.length}
        </span>
        <button
          type="button"
          aria-label="Next member"
          disabled={active === profiles.length - 1}
          onClick={() => {
            setDirection("next");
            setActive((index) => Math.min(profiles.length - 1, index + 1));
          }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
