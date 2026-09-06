"use client";
import { useRef, useState } from "react";
import type { Activity } from "@/lib/types";
import { ActivityCard, EmptyState } from "./ui";
import { isUpcoming } from "@/lib/utils";

const normalizeCategory = (category: string) =>
  category === "Hackathons" ? "Hackathon" : category;

function CategoryDropdown({
  label,
  categories,
  active,
  selectedCategory,
  onSelect,
}: {
  label: "Initiatives" | "Events";
  categories: string[];
  active: boolean;
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => detailsRef.current?.removeAttribute("open");

  return (
    <details
      ref={detailsRef}
      className={`filter-dropdown ${active ? "selected" : ""}`}
      name="activity-category-filter"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown();
      }}
    >
      <summary>
        <span>{label}</span>
        <svg viewBox="0 0 12 8" aria-hidden="true">
          <path d="m1 1 5 5 5-5" />
        </svg>
      </summary>
      <div className="filter-dropdown-menu">
        {["All", ...categories].map((value) => (
          <button
            type="button"
            key={value}
            className={active && selectedCategory === value ? "selected" : ""}
            aria-pressed={active && selectedCategory === value}
            onClick={() => {
              onSelect(value);
              closeDropdown();
            }}
          >
            {value === "All" ? `All ${label.toLowerCase()}` : value}
          </button>
        ))}
      </div>
    </details>
  );
}

export function ActivityBrowser({
  activities,
  kind,
  now,
}: {
  activities: Activity[];
  kind: "event" | "initiative" | "all";
  now: number;
}) {
  const [selectedKind, setSelectedKind] = useState<"all" | Activity["kind"]>(
    kind,
  );
  const [category, setCategory] = useState("All");
  const [time, setTime] = useState("All");
  const filterKind = kind === "all" ? selectedKind : kind;
  const categoriesFor = (activityKind: Activity["kind"]) => [
    ...new Set(
      activities
        .filter((item) => item.kind === activityKind)
        .map((item) => normalizeCategory(item.category))
        .filter(
          (category) =>
            category && (activityKind === "event" || category !== "Hackathon"),
        ),
    ),
  ];
  const events = activities.filter((item) => item.kind === "event");
  const filtered = activities.filter((item) => {
    const matchesKind = filterKind === "all" || item.kind === filterKind;
    const matchesCategory =
      category === "All" || normalizeCategory(item.category) === category;
    const matchesTime =
      time === "All" ||
      (item.kind === "event" &&
        (time === "Upcoming" ? isUpcoming(item, now) : !isUpcoming(item, now)));

    return matchesKind && matchesCategory && matchesTime;
  });
  const resultNoun =
    filterKind === "all"
      ? "activity"
      : filterKind === "event"
        ? "event"
        : "initiative";
  const emptyNoun = filterKind === "all" ? "activities" : `${resultNoun}s`;

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
      {kind === "all" ? (
        <div
          className="filter-row activity-filter-row"
          role="group"
          aria-label="Filter activities"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedKind("all");
              setCategory("All");
              setTime("All");
            }}
            aria-pressed={filterKind === "all"}
            className={`filter-chip ${filterKind === "all" ? "selected" : ""}`}
          >
            All
          </button>
          <CategoryDropdown
            label="Initiatives"
            categories={categoriesFor("initiative")}
            active={filterKind === "initiative"}
            selectedCategory={category}
            onSelect={(value) => {
              setSelectedKind("initiative");
              setCategory(value);
              setTime("All");
            }}
          />
          <CategoryDropdown
            label="Events"
            categories={categoriesFor("event")}
            active={filterKind === "event"}
            selectedCategory={category}
            onSelect={(value) => {
              setSelectedKind("event");
              setCategory(value);
              setTime("All");
            }}
          />
        </div>
      ) : (
        <div
          className="filter-row"
          role="group"
          aria-label="Filter by category"
        >
          {["All", ...categoriesFor(kind)].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={`filter-chip ${category === value ? "selected" : ""}`}
            >
              {value}
            </button>
          ))}
        </div>
      )}
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
          {(filterKind !== kind || category !== "All" || time !== "All") && (
            <button
              className="text-link reset-filters"
              onClick={() => {
                setSelectedKind(kind);
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
