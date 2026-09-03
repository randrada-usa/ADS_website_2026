"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { Spark } from "./icons";
import { ButtonLink } from "./ui";
import { activityHref } from "@/lib/utils";
import {
  flatPose,
  liftedPose,
  poseTransform,
  stackPose,
  stepSpring,
  zeroVelocity,
  type CardPose,
} from "@/lib/initiative-motion";
import type { Activity } from "@/lib/types";

type Drag = {
  pointerId: number;
  node: HTMLDivElement;
  startX: number;
  startY: number;
  moved: boolean;
  origin: CardPose;
};
type Motion = {
  node: HTMLDivElement;
  position: CardPose;
  velocity: CardPose;
  target: CardPose;
  lastTime: number;
  frequency: number;
  damping: number;
  dragging: boolean;
};

function motionTransform(node: HTMLDivElement, pose: CardPose) {
  return poseTransform(pose, node.classList.contains("initiative-photo-drag"));
}

function updatePhotoClip(stack: HTMLDivElement) {
  const section = stack.closest("section")!.getBoundingClientRect();
  const rect = stack.getBoundingClientRect();
  // Let the held card travel freely. Only its visible overflow is clipped at
  // the viewport sides and the boundaries of the neighboring sections.
  stack.style.clipPath = `inset(${section.top - rect.top}px ${rect.right - document.documentElement.clientWidth}px ${rect.bottom - section.bottom}px ${-rect.left}px)`;
}

function SplitTitle({ title }: { title: string }) {
  const words = title.split(" ");
  const splitAt = Math.max(1, words.length - 2);
  return (
    <>
      {words.slice(0, splitAt).join(" ")}{" "}
      <span className="gradient-text">{words.slice(splitAt).join(" ")}</span>
    </>
  );
}

export function InitiativeShowcase({ activities }: { activities: Activity[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardsRef = useRef(new Map<string, HTMLDivElement>());
  const photosRef = useRef(new Map<string, HTMLDivElement>());
  const stackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const motionsRef = useRef(new Map<HTMLDivElement, Motion>());
  const frameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const suppressClickRef = useRef(false);
  const previousIndexRef = useRef(0);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const section = stack?.closest("section");
    if (!stack || !section) return;
    const update = () => {
      updatePhotoClip(stack);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stack);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = preference.matches;
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const stop = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      const drag = dragRef.current;
      dragRef.current = null;
      suppressClickRef.current = Boolean(drag);
      if (drag?.node.hasPointerCapture(drag.pointerId))
        drag.node.releasePointerCapture(drag.pointerId);
      drag?.node.style.removeProperty("transform");
      for (const motion of motionsRef.current.values())
        motion.node.style.removeProperty("transform");
      motionsRef.current.clear();
      frameRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("blur", stop);
    return () => {
      preference.removeEventListener("change", updatePreference);
      window.removeEventListener("blur", stop);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const active = activities[activeIndex] ?? activities[0];

  const runMotionFrame = useCallback(() => {
    if (frameRef.current !== null) return;
    const tick = (time: number) => {
      for (const [node, motion] of motionsRef.current) {
        const dt = motion.lastTime ? (time - motion.lastTime) / 1000 : 1 / 60;
        motion.lastTime = time;
        const settled = stepSpring(
          motion.position,
          motion.velocity,
          motion.target,
          dt,
          motion.frequency,
          motion.damping,
        );
        if (node.classList.contains("initiative-photo-drag")) {
          const tilt = liftedPose(motion.position.x, motion.position.y);
          motion.position.rotateX = tilt.rotateX;
          motion.position.rotateY = tilt.rotateY;
        }
        node.style.transform = motionTransform(node, motion.position);
        if (settled && !motion.dragging) {
          node.style.removeProperty("transform");
          motionsRef.current.delete(node);
        }
      }
      const moving = [...motionsRef.current.values()].some((motion) =>
        Object.keys(motion.position).some((key) => {
          const axis = key as keyof CardPose;
          return (
            motion.position[axis] !== motion.target[axis] ||
            Math.abs(motion.velocity[axis]) > 0.35
          );
        }),
      );
      frameRef.current = moving ? requestAnimationFrame(tick) : null;
    };
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const retarget = useCallback(
    (
      node: HTMLDivElement,
      target: CardPose,
      initial: CardPose,
      frequency: number,
      dragging = false,
      damping = 1,
    ) => {
      if (reducedMotionRef.current) {
        motionsRef.current.delete(node);
        if (dragging) node.style.transform = motionTransform(node, target);
        else node.style.removeProperty("transform");
        return;
      }
      const previous = motionsRef.current.get(node);
      const motion: Motion = {
        node,
        position: previous?.position ?? { ...initial },
        velocity: previous?.velocity ?? zeroVelocity(),
        target,
        frequency,
        damping,
        dragging,
        lastTime: frameRef.current === null ? 0 : (previous?.lastTime ?? 0),
      };
      motionsRef.current.set(node, motion);
      // Preserve the visible pose through the React update and the next paint.
      node.style.transform = motionTransform(node, motion.position);
      runMotionFrame();
    },
    [runMotionFrame],
  );

  useLayoutEffect(() => {
    const previousIndex = previousIndexRef.current;
    if (previousIndex === activeIndex) return;
    previousIndexRef.current = activeIndex;
    const stack = stackRef.current;
    if (!stack) return;
    // Every card gets its latest destination, including returns interrupted by
    // another switch. Positions and velocities survive each retarget.
    activities.forEach((activity, index) => {
      const node = photosRef.current.get(activity._id);
      const dragLayer = cardsRef.current.get(activity._id);
      if (!node || !dragLayer) return;
      const offset =
        (index - activeIndex + activities.length) % activities.length;
      const previousOffset =
        (index - previousIndex + activities.length) % activities.length;
      retarget(
        node,
        stackPose(offset),
        stackPose(previousOffset),
        20,
        false,
        0.64,
      );
      // Returning photos are already behind the new front card. Their slower
      // travel is independent of the short spring that brings the stack forward.
      if (motionsRef.current.has(dragLayer))
        retarget(
          dragLayer,
          flatPose(),
          flatPose(),
          offset === 0 ? 28 : 20,
          false,
          offset === 0 ? 1 : 2,
        );
    });
  }, [activeIndex, activities, retarget]);

  function animate(node: HTMLDivElement, target: CardPose) {
    retarget(node, target, flatPose(), 40, true);
    const motion = motionsRef.current.get(node);
    if (motion) {
      // Both travel and tilt respond in this pointer event, without spring lag.
      Object.assign(motion.position, target);
      motion.velocity = zeroVelocity();
      node.style.transform = motionTransform(node, motion.position);
    }
  }

  function settle(node: HTMLDivElement, nextIndex = activeIndex) {
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    } else {
      retarget(node, flatPose(), flatPose(), 32);
      const photo = photosRef.current.get(active._id);
      if (photo) retarget(photo, stackPose(0), stackPose(0), 20, false, 0.64);
    }
    setIsDragging(false);
  }

  function advance(direction: 1 | -1 = 1) {
    if (!active || activities.length < 2 || dragRef.current) return;
    const node = cardsRef.current.get(active._id);
    if (!node) return;
    settle(
      node,
      (activeIndex + direction + activities.length) % activities.length,
    );
  }

  const autoAdvance = useEffectEvent(() => {
    if (!document.hidden && !dragRef.current) advance();
  });

  useEffect(() => {
    if (activities.length < 2 || isDragging) return;
    // Start a fresh seven-second interval after each manual or automatic switch.
    const timer = window.setInterval(autoAdvance, 7000);
    return () => window.clearInterval(timer);
  }, [activeIndex, activities.length, isDragging]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    suppressClickRef.current = false;
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(min-width: 651px) and (hover: hover) and (pointer: fine)",
      ).matches ||
      !event.isPrimary ||
      event.button !== 0 ||
      activities.length < 2 ||
      dragRef.current
    )
      return;
    const node = cardsRef.current.get(active._id);
    if (!node) return;
    if (stackRef.current) updatePhotoClip(stackRef.current);
    dragRef.current = {
      pointerId: event.pointerId,
      node,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...(motionsRef.current.get(node)?.position ?? flatPose()) },
      moved: false,
    };
    // Capture at press, before a moving card can slip out from under the pointer.
    // Freeze its current pose immediately; taps still switch without a lift.
    node.setPointerCapture(event.pointerId);
    const origin = dragRef.current.origin;
    retarget(node, { ...origin }, origin, 40, true);
    const held = motionsRef.current.get(node);
    if (held) held.velocity = zeroVelocity();
    const photo = photosRef.current.get(active._id);
    if (photo) {
      const pose = {
        ...(motionsRef.current.get(photo)?.position ?? stackPose(0)),
      };
      retarget(photo, pose, pose, 20, true, 0.64);
      const heldPhoto = motionsRef.current.get(photo);
      if (heldPhoto) heldPhoto.velocity = zeroVelocity();
    }
    for (const motion of motionsRef.current.values()) {
      if (!motion.dragging) {
        motion.frequency = 32;
        if (motion.node.classList.contains("initiative-photo-drag"))
          motion.damping = 1;
      }
    }
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const x = event.clientX - drag.startX;
    const y = event.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.hypot(x, y) <= 3) return;
      drag.moved = true;
    }
    animate(
      drag.node,
      liftedPose(
        drag.origin.x + x * 0.6,
        drag.origin.y + y * 0.6,
        reducedMotionRef.current,
      ),
    );
  }

  function finishPointer(
    event: PointerEvent<HTMLDivElement>,
    cancelled = false,
  ) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (drag.node.hasPointerCapture(event.pointerId))
      drag.node.releasePointerCapture(event.pointerId);
    suppressClickRef.current = drag.moved || cancelled;
    if (!drag.moved) {
      settle(drag.node);
      return;
    }
    settle(
      drag.node,
      !cancelled && drag.moved
        ? (activeIndex + 1) % activities.length
        : activeIndex,
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Escape" && dragRef.current) {
      event.preventDefault();
      const drag = dragRef.current;
      dragRef.current = null;
      suppressClickRef.current = true;
      if (drag.node.hasPointerCapture(drag.pointerId))
        drag.node.releasePointerCapture(drag.pointerId);
      settle(drag.node);
    } else if (["ArrowRight", "ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      advance();
    } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      advance(-1);
    }
  }

  if (!active) return null;

  return (
    <div className="initiative-showcase">
      <div
        className="initiative-showcase-copy"
        key={active._id}
        aria-live="off"
        aria-atomic="true"
      >
        <h3>
          <SplitTitle title={active.title} />
        </h3>
        <p>{active.summary}</p>
      </div>
      <div className="initiative-showcase-controls">
        <ButtonLink href={activityHref(active)} tone="orange">
          Explore this story
        </ButtonLink>
      </div>
      <div
        className={`initiative-showcase-media${isDragging ? " is-dragging-active" : ""}`}
      >
        <div
          ref={stackRef}
          className="initiative-photo-stack"
          tabIndex={activities.length > 1 ? 0 : undefined}
          role="group"
          aria-roledescription="carousel"
          aria-label={`Initiative ${activeIndex + 1} of ${activities.length}. Activate or use the arrow keys to change stories.`}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishPointer(event)}
          onPointerCancel={(event) => finishPointer(event, true)}
          onLostPointerCapture={(event) => finishPointer(event, true)}
          onClick={() => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              return;
            }
            advance();
          }}
        >
          {activities.map((activity, index) => {
            const offset =
              (index - activeIndex + activities.length) % activities.length;
            const isTop = offset === 0;
            return (
              <div
                key={activity._id}
                ref={(node) => {
                  if (node) cardsRef.current.set(activity._id, node);
                  else cardsRef.current.delete(activity._id);
                }}
                className={`initiative-photo-drag${isTop && isDragging ? " is-dragging" : ""}`}
                style={
                  {
                    "--stack-offset": offset,
                    zIndex: activities.length - offset,
                    visibility: offset < 3 ? "visible" : "hidden",
                  } as CSSProperties
                }
                aria-hidden={!isTop}
              >
                <div
                  ref={(node) => {
                    if (node) photosRef.current.set(activity._id, node);
                    else photosRef.current.delete(activity._id);
                  }}
                  className={`initiative-photo-card${isTop && activities.length > 1 ? " is-draggable" : ""}`}
                >
                  {activity.image ? (
                    <Image
                      src={activity.image}
                      alt={isTop ? activity.imageAlt || activity.title : ""}
                      fill
                      sizes="(max-width: 850px) 90vw, 48vw"
                      draggable={false}
                      priority={isTop}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <Spark />
                      <span>Photo coming soon</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
