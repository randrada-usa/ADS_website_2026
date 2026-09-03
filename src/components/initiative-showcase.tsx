"use client";

import Image from "next/image";
import { useState, useRef, useEffect, type CSSProperties } from "react";
import { Spark } from "./icons";
import { ButtonLink } from "./ui";
import { activityHref } from "@/lib/utils";
import type { Activity } from "@/lib/types";

function SplitTitle({ title }: { title: string }) {
  const words = title.split(" ");
  const splitAt = Math.max(1, words.length - 2);
  const lead = words.slice(0, splitAt).join(" ");
  const accent = words.slice(splitAt).join(" ");

  return (
    <>
      {lead && `${lead} `}
      <span className="gradient-text">{accent}</span>
    </>
  );
}

export function InitiativeShowcase({ activities }: { activities: Activity[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [exitingCard, setExitingCard] = useState<{
    activity: Activity;
    exitX: number;
    exitY: number;
    rotate: number;
  } | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const startRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const snapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  const active = activities[activeIndex] ?? activities[0];

  const lastAdvanceTimeRef = useRef<number>(0);
  const dragOccurredRef = useRef<boolean>(false);

  const advanceWithAnimation = (
    target: number | "next" | "prev",
  ) => {
    if (activities.length <= 1) return;

    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 350) return;
    lastAdvanceTimeRef.current = now;

    setHasInteracted(true);

    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
    }
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
      setIsSnapping(false);
    }

    let nextIndex: number;
    let exitDirection: "right" | "left" = "right";

    if (typeof target === "number") {
      if (target === activeIndex) return;
      nextIndex = target;
      exitDirection = target > activeIndex ? "right" : "left";
    } else if (target === "prev") {
      nextIndex = (activeIndex - 1 + activities.length) % activities.length;
      exitDirection = "left";
    } else {
      nextIndex = (activeIndex + 1) % activities.length;
      exitDirection = "right";
    }

    const isRight = exitDirection === "right";
    const exitX = isRight ? 550 : -550;
    const exitY = -25;
    const rotate = isRight ? 16 : -16;

    setExitingCard({
      activity: active,
      exitX,
      exitY,
      rotate,
    });

    setActiveIndex(nextIndex);
    setDragOffset(null);
    setIsDragging(false);

    exitTimerRef.current = setTimeout(() => {
      setExitingCard(null);
    }, 340);
  };

  if (!active) return null;

  const stacked = activities.map(
    (_, offset) => activities[(activeIndex + offset) % activities.length],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (activities.length <= 1) return;

    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      setExitingCard(null);
    }
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
      setIsSnapping(false);
    }

    dragOccurredRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    pointerIdRef.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Non-blocking fallback
    }

    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current || pointerIdRef.current !== e.pointerId) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.hypot(dx, dy) > 8) {
      dragOccurredRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current || pointerIdRef.current !== e.pointerId) return;

    const start = startRef.current;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - start.time;
    const velocity = dist / Math.max(1, duration);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Non-blocking fallback
    }

    startRef.current = null;
    pointerIdRef.current = null;
    setIsDragging(false);

    // Threshold check for drag/flick
    if (dist > 65 || (dist > 25 && velocity > 0.45)) {
      let exitX = 0;
      let exitY = 0;
      let rotate = 0;

      if (Math.abs(dx) >= Math.abs(dy) * 0.7) {
        const isRight = dx >= 0;
        exitX = isRight ? 550 : -550;
        exitY = dy * 1.4;
        rotate = (isRight ? 1 : -1) * (16 + Math.min(10, Math.abs(dx) * 0.04));
      } else {
        const isDown = dy > 0;
        exitY = isDown ? 450 : -450;
        exitX = dx * 1.4;
        rotate = dx * 0.08 || -10;
      }

      setExitingCard({
        activity: active,
        exitX,
        exitY,
        rotate,
      });

      lastAdvanceTimeRef.current = Date.now();
      setActiveIndex((prev) => (prev + 1) % activities.length);
      setDragOffset(null);

      exitTimerRef.current = setTimeout(() => {
        setExitingCard(null);
      }, 340);
    } else if (dist <= 8 && duration < 350) {
      // Clean click/tap on the card: trigger click animation!
      advanceWithAnimation("next");
    } else {
      if (dist > 4) {
        setIsSnapping(true);
        setDragOffset({ x: 0, y: 0 });
        snapTimerRef.current = setTimeout(() => {
          setIsSnapping(false);
          setDragOffset(null);
        }, 300);
      } else {
        setDragOffset(null);
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      startRef.current = null;
      pointerIdRef.current = null;
      setIsDragging(false);
      setIsSnapping(true);
      setDragOffset({ x: 0, y: 0 });
      snapTimerRef.current = setTimeout(() => {
        setIsSnapping(false);
        setDragOffset(null);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      advanceWithAnimation("next");
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      advanceWithAnimation("prev");
    }
  };

  const dragDist = isDragging && dragOffset ? Math.hypot(dragOffset.x, dragOffset.y) : 0;
  const dragProgress = Math.min(1, dragDist / 130);

  return (
    <div className="initiative-showcase">
      <div className="initiative-showcase-copy" key={active._id}>
        <h3>
          <SplitTitle title={active.title} />
        </h3>
        <p>{active.summary}</p>
      </div>

      <div className="initiative-showcase-controls">
        <ButtonLink href={activityHref(active)} tone="orange">
          Explore this story
        </ButtonLink>
        <div
          className="initiative-switcher"
          role="group"
          aria-label="Choose a featured initiative"
        >
          {activities.map((activity, index) => (
            <button
              key={activity._id}
              type="button"
              className={index === activeIndex ? "selected" : ""}
              aria-pressed={index === activeIndex}
              aria-label={`Show ${activity.title}`}
              onClick={() => {
                advanceWithAnimation(index);
              }}
            >
              <span>0{index + 1}</span>
              {activity.title}
            </button>
          ))}
        </div>
      </div>

      <div className={`initiative-showcase-media ${isDragging || exitingCard ? "is-dragging-active" : ""}`}>
        <svg className="section-outline initiative-outline initiative-outline-top" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="12" y="12" width="76" height="76" />
        </svg>

        <div
          className="initiative-photo-stack"
          tabIndex={0}
          role="region"
          aria-label="Interactive initiative cards. Drag or click cards to advance, or use arrow keys."
          onKeyDown={handleKeyDown}
        >
          <div
            className={`initiative-drag-hint ${hasInteracted ? "is-faded" : ""}`}
            aria-hidden="true"
            onClick={() => advanceWithAnimation("next")}
          >
            <span className="drag-hint-arrows">‹ ↔ ›</span>
            <span>Click or drag to switch</span>
          </div>

          {exitingCard && (
            <div
              className="initiative-photo-card is-exiting"
              style={
                {
                  "--stack-offset": 0,
                  zIndex: 20,
                  transform: `translate(${exitingCard.exitX}px, ${exitingCard.exitY}px) rotate(${exitingCard.rotate}deg)`,
                  opacity: 0,
                } as CSSProperties
              }
              aria-hidden="true"
            >
              {exitingCard.activity.image ? (
                <Image
                  src={exitingCard.activity.image}
                  alt=""
                  fill
                  sizes="(max-width: 850px) 90vw, 48vw"
                  draggable={false}
                />
              ) : (
                <div className="image-placeholder">
                  <Spark />
                  <span>Photo coming soon</span>
                </div>
              )}
              {exitingCard.activity.demo && (
                <span className="photo-label">STOCK PHOTO · PLACEHOLDER</span>
              )}
            </div>
          )}

          {stacked.slice(0, 3).map((activity, offset) => {
            const isTop = offset === 0;
            const dynamicOffset =
              isDragging && offset > 0
                ? Math.max(0, offset - dragProgress * 0.72)
                : offset;

            let cardStyle: CSSProperties = {
              "--stack-offset": dynamicOffset,
              zIndex: stacked.length - offset,
            } as CSSProperties;

            if (isTop) {
              if (isDragging && dragOffset) {
                cardStyle = {
                  ...cardStyle,
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg) scale(1.02)`,
                  transition: "none",
                  zIndex: 10,
                };
              } else if (isSnapping && dragOffset) {
                cardStyle = {
                  ...cardStyle,
                  transform: `translate(0px, 0px) rotate(0deg) scale(1)`,
                  transition: "transform 300ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms ease",
                  zIndex: 10,
                };
              }
            } else if (isDragging) {
              cardStyle = {
                ...cardStyle,
                transition: "transform 60ms linear",
              };
            }

            const cardClasses = [
              "initiative-photo-card",
              isTop ? "is-top-card is-draggable" : "is-stacked-card",
              isTop && isDragging ? "is-dragging" : "",
              isTop && isSnapping ? "is-snapping" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                className={cardClasses}
                key={activity._id}
                style={cardStyle}
                aria-hidden={offset !== 0}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerCancel : undefined}
                onClick={
                  isTop
                    ? () => {
                        if (!dragOccurredRef.current) {
                          advanceWithAnimation("next");
                        }
                      }
                    : () => {
                        advanceWithAnimation((activeIndex + offset) % activities.length);
                      }
                }
              >
                {activity.image ? (
                  <Image
                    src={activity.image}
                    alt={offset === 0 ? activity.imageAlt || activity.title : ""}
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
                {offset === 0 && activity.demo && (
                  <span className="photo-label">STOCK PHOTO · PLACEHOLDER</span>
                )}
              </div>
            );
          })}
        </div>
        <svg className="section-outline initiative-outline initiative-outline-bottom" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="38" />
        </svg>
      </div>
    </div>
  );
}

