"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Arrow, Spark } from "./icons";
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
        <span className="eyebrow">Our initiatives · {active.category}</span>
        <h3>
          <SplitTitle title={active.title} />
        </h3>
        <p>{active.summary}</p>
        <Link className="text-link" href={activityHref(active)}>
          Explore this story
          <Arrow diagonal />
        </Link>
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
        <Spark className="initiative-burst initiative-burst-top" />
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
        <Spark className="initiative-burst initiative-burst-bottom" />
      </div>
    </div>
  );
}
