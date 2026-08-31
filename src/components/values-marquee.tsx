"use client";

import { useState } from "react";
import { Spark } from "./icons";

const values = [
  "Curiosity meets community.",
  "Ideas become impact.",
  "Augustinian at heart.",
];

export function ValuesMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="values-strip"
      aria-label="Our values"
      data-paused={paused}
    >
      <div className="values-window">
        <div className="values-track">
          {[0, 1].map((copy) => (
            <div
              className="values-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {values.map((value) => (
                <span className="values-item" key={value}>
                  {value}
                  <Spark />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="values-toggle"
        aria-label={
          paused ? "Resume values animation" : "Pause values animation"
        }
        onClick={() => setPaused(!paused)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          {paused ? (
            <path d="m5 3 8 5-8 5Z" />
          ) : (
            <path d="M4 3h3v10H4zm5 0h3v10H9z" />
          )}
        </svg>
      </button>
    </section>
  );
}
