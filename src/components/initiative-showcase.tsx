"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
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
  const active = activities[activeIndex] ?? activities[0];

  if (!active) return null;

  const stacked = activities.map(
    (_, offset) => activities[(activeIndex + offset) % activities.length],
  );

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
              onClick={() => setActiveIndex(index)}
            >
              <span>0{index + 1}</span>
              {activity.title}
            </button>
          ))}
        </div>
      </div>
      <div className="initiative-showcase-media">
        <svg className="section-outline initiative-outline initiative-outline-top" viewBox="0 0 100 100" aria-hidden="true">
          <rect x="12" y="12" width="76" height="76" />
        </svg>
        <div className="initiative-photo-stack">
          {stacked.slice(0, 3).map((activity, offset) => (
            <div
              className="initiative-photo-card"
              key={activity._id}
              style={
                {
                  "--stack-offset": offset,
                  zIndex: stacked.length - offset,
                } as CSSProperties
              }
              aria-hidden={offset !== 0}
            >
              {activity.image ? (
                <Image
                  src={activity.image}
                  alt={offset === 0 ? activity.imageAlt || activity.title : ""}
                  fill
                  sizes="(max-width: 850px) 90vw, 48vw"
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
          ))}
        </div>
        <svg className="section-outline initiative-outline initiative-outline-bottom" viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,7 88,29 88,71 50,93 12,71 12,29" />
        </svg>
      </div>
    </div>
  );
}
