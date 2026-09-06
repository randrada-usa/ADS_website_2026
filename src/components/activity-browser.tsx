"use client";
import { useState } from "react";
import type { Activity } from "@/lib/types";
import { ActivityCard, EmptyState } from "./ui";
import { isUpcoming } from "@/lib/utils";

const normalizeCategory = (category: string) =>
  category === "Hackathons" ? "Hackathon" : category;

export function ActivityBrowser({
  activities,
  kind,
  now,
}: {
  activities: Activity[];
  kind: "event" | "initiative" | "all";
  now: number;
}) {
  const [category, setCategory] = useState("All");
  const [time, setTime] = useState("All");
  const categories = [
    "All",
    ...new Set(
      activities
        .map((item) => normalizeCategory(item.category))
        .filter(Boolean),
    ),
  ];
  const events = activities.filter((item) => item.kind === "event");
  const filtered = activities.filter((item) => {
    const matchesCategory =
      category === "All" || normalizeCategory(item.category) === category;
    const matchesTime =
      time === "All" ||
      (item.kind === "event" &&
        (time === "Upcoming"
          ? isUpcoming(item, now)
          : !isUpcoming(item, now)));

    return matchesCategory && matchesTime;
  });
  const resultNoun =
    kind === "all" ? "activity" : kind === "event" ? "event" : "initiative";
  const emptyNoun = kind === "all" ? "activities" : `${resultNoun}s`;

  return (
    <div>
      {kind === "event" && (
        <div
          className="event-time-filters"
          role="group"
          aria-label="Event timing"
        >
          {["All", "Upcoming", "Past"].map((value) => (
            <button
              key={value}
              onClick={() => setTime(value)}
              aria-pressed={time === value}
              className={time === value ? "selected" : ""}
            >
              {value === "All" ? "All events" : value}
              <span>
                {value === "All"
                  ? activities.length
                  : events.filter((item) =>
                      value === "Upcoming"
                        ? isUpcoming(item, now)
                        : !isUpcoming(item, now),
                    ).length}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="filter-row" role="group" aria-label="Filter by category">
        {categories.map((value) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            aria-pressed={category === value}
            className={`filter-chip ${category === value ? "selected" : ""}`}
          >
            {value}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="activity-grid">
          {filtered.map((item) => (
            <ActivityCard key={item._id} activity={item} />
          ))}
        </div>
      ) : (
        <EmptyState>
          No {time === "Upcoming" ? "upcoming " : ""}
          {emptyNoun} here yet.
          {(category !== "All" || time !== "All") && (
            <button
              className="text-link reset-filters"
              onClick={() => {
                setCategory("All");
                setTime("All");
              }}
            >
              Reset filters ↗
            </button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
