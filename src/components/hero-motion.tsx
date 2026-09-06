"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function HeroMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        pointer: "(hover: hover) and (pointer: fine)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const select = gsap.utils.selector(root);
        const motionLayers = [
          {
            selector: ".hero-logo-group",
            x: 12,
            y: 9,
            tilt: 1.5,
            duration: 0.9,
          },
          // Quiet background drift, coordinated labels, and a closer foreground spark.
          { selector: ".hero-circle", x: -4, y: -3, tilt: 0, duration: 1.25 },
          {
            selector: ".label-build",
            x: -10,
            y: -6,
            tilt: -0.9,
            duration: 1.05,
          },
          {
            selector: ".label-impact",
            x: -7,
            y: -9,
            tilt: 0.8,
            duration: 1.15,
          },
          { selector: ".hero-spark", x: 16, y: 10, tilt: 0, duration: 0.85 },
          { selector: ".hand-arrow", x: 4, y: 3, tilt: 0.5, duration: 1.15 },
          { selector: ".art-caption", x: 3, y: 2, tilt: 0, duration: 1.25 },
        ].map((layer) => {
          const element = select(layer.selector)[0];
          return {
            ...layer,
            element,
            rotation: Number(gsap.getProperty(element, "rotation")),
          };
        });
        const iconRotations = new Map<HTMLElement, number>(
          select(".small-department-icons img").map((icon: HTMLElement) => [
            icon,
            Number(gsap.getProperty(icon, "rotation")),
          ]),
        );
        let settled = false;
        let inView = root.getBoundingClientRect().bottom > 0;
        const ambient = [
          gsap.to(select(".hero-spark"), {
            rotation: "+=360",
            duration: 28,
            ease: "none",
            repeat: -1,
            paused: true,
          }),
        ];
        const syncAmbient = () => {
          ambient.forEach((tween) => {
            if (settled && inView && !document.hidden) tween.play();
            else tween.pause();
          });
        };
        const visibilityObserver = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncAmbient();
        });
        visibilityObserver.observe(root);
        document.addEventListener("visibilitychange", syncAmbient);
        const entrance = gsap.timeline({
          paused: true,
          defaults: { duration: 1, ease: "power3.out" },
          onComplete: () => {
            settled = true;
            syncAmbient();
          },
        });
        entrance
          .from(
            select(".hero-copy h1 > span"),
            {
              y: 48,
              rotation: -3,
              scale: 0.94,
              opacity: 0,
              transformOrigin: "left bottom",
              stagger: 0.14,
              ease: "back.out(1.3)",
            },
            0,
          )
          .from(
            select(".hero-logo-group"),
            {
              scale: 0.55,
              y: 64,
              rotation: -20,
              opacity: 0,
              duration: 1.5,
              ease: "elastic.out(1, 0.65)",
            },
            0.15,
          )
          .from(
            select(".hero-circle, .hero-spark"),
            {
              scale: 0,
              rotation: "-=55",
              opacity: 0,
              stagger: 0.18,
              ease: "back.out(1.8)",
              transformOrigin: "50% 50%",
            },
            0.55,
          )
          .from(
            select(".hero-copy .small-department-icons img"),
            {
              y: 22,
              scale: 0.4,
              rotation: "-=20",
              opacity: 0,
              stagger: 0.07,
              duration: 0.8,
              ease: "back.out(2)",
            },
            0.65,
          )
          .from(
            select(".university, .hero-actions > a"),
            {
              y: 24,
              opacity: 0,
              stagger: 0.12,
            },
            0.7,
          )
          .from(
            select(".floating-label"),
            {
              y: 30,
              scale: 0.7,
              rotation: "-=12",
              opacity: 0,
              stagger: 0.18,
              ease: "back.out(1.8)",
            },
            0.8,
          )
          .from(
            select(".hand-arrow, .art-caption"),
            {
              y: 12,
              opacity: 0,
              stagger: 0.1,
            },
            1.1,
          );

        // Observe the existing loader; keep its timing and behavior unchanged.
        const loader = document.querySelector<HTMLElement>(".site-loader");
        const start = () => {
          if (loader?.dataset.state) return;
          observer?.disconnect();
          if (
            root.getBoundingClientRect().bottom <= 0 ||
            window.scrollY > root.offsetHeight / 2
          ) {
            entrance.progress(1);
          } else entrance.play();
        };
        const observer = loader ? new MutationObserver(start) : null;
        observer?.observe(loader!, {
          attributes: true,
          attributeFilter: ["data-state"],
        });
        const frame = requestAnimationFrame(start);

        const cleanups: Array<() => void> = [];
        if (context.conditions.pointer) {
          const followers = motionLayers.map((layer) => {
            const options = { duration: layer.duration, ease: "power3.out" };
            return {
              ...layer,
              xTo: gsap.quickTo(layer.element, "x", options),
              yTo: gsap.quickTo(layer.element, "y", options),
              // The spark's rotation belongs to its continuous spin.
              tiltTo:
                layer.selector === ".hero-spark"
                  ? null
                  : gsap.quickTo(layer.element, "rotation", options),
            };
          });
          const move = (event: PointerEvent) => {
            if (!settled || event.pointerType !== "mouse") return;
            const bounds = root.getBoundingClientRect();
            const x = gsap.utils.clamp(
              -1,
              1,
              ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            );
            const y = gsap.utils.clamp(
              -1,
              1,
              ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
            );
            followers.forEach((layer) => {
              layer.xTo(x * layer.x);
              layer.yTo(y * layer.y);
              layer.tiltTo?.(layer.rotation + x * layer.tilt);
            });
          };
          const reset = () => {
            if (!settled) return;
            followers.forEach((layer) => {
              layer.xTo(0);
              layer.yTo(0);
              layer.tiltTo?.(layer.rotation);
            });
          };
          root.addEventListener("pointermove", move);
          root.addEventListener("pointerleave", reset);
          cleanups.push(() => {
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", reset);
          });

          select(".small-department-icons img").forEach((icon: HTMLElement) => {
            const originalRotation = iconRotations.get(icon) ?? 0;
            // Separate prebuilt hover tweens avoid accumulating animations on rapid movement.
            const hover = gsap.timeline({ paused: true }).to(icon, {
              y: -7,
              scale: 1.18,
              rotation: originalRotation + 9,
              duration: 0.45,
              ease: "back.out(1.8)",
              overwrite: "auto",
            });
            const enter = () => {
              if (settled) hover.play();
            };
            const leave = () => {
              if (settled) hover.reverse();
            };
            icon.addEventListener("pointerenter", enter);
            icon.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              icon.removeEventListener("pointerenter", enter);
              icon.removeEventListener("pointerleave", leave);
            });
          });
        }
        return () => {
          cancelAnimationFrame(frame);
          observer?.disconnect();
          visibilityObserver.disconnect();
          document.removeEventListener("visibilitychange", syncAmbient);
          cleanups.forEach((cleanup) => cleanup());
        };
      },
      root,
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} id="home" className="hero container">
      {children}
    </section>
  );
}
