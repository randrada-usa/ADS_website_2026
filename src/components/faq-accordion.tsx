"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/types";

const accents = ["#3c6597", "#61ad9e", "#f2ba5e", "#e2815a", "#df5b5b"];

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?._id ?? null);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq._id;
        const answerId = `faq-answer-${faq._id}`;

        return (
          <article
            className={`faq-item${isOpen ? " is-open" : ""}`}
            key={faq._id}
          >
            <h3>
              <button
                className="faq-question"
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenId(isOpen ? null : faq._id)}
              >
                <span>{faq.question}</span>
                <span
                  className="faq-toggle"
                  style={{ backgroundColor: accents[index % accents.length] }}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div className="faq-answer-shell" aria-hidden={!isOpen}>
              <div>
                <div className="faq-answer" id={answerId}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
