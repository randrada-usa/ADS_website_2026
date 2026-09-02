import type { ReactNode } from "react";
import { Eyebrow } from "./ui";

interface JourneyMilestone {
  id: string;
  year: string;
  category: string;
  color: "blue" | "teal" | "yellow" | "orange" | "red";
  side: "left" | "right";
  content: ReactNode;
}

const MILESTONES: JourneyMilestone[] = [
  {
    id: "beginning",
    year: "2021",
    category: "The Beginning",
    color: "blue",
    side: "left",
    content: (
      <>
        Originally established in July 2021 as the{" "}
        <strong>Google Developer Student Clubs – University of San Agustin (GDSC-USA)</strong>.
      </>
    ),
  },
  {
    id: "foundation",
    year: "2021",
    category: "The Foundation",
    color: "teal",
    side: "right",
    content: (
      <>
        Founded by <strong>Christian Dave Montalban</strong> alongside a core team of student
        innovators, created as a platform for students to nurture and share their technical
        knowledge.
      </>
    ),
  },
  {
    id: "rebranding",
    year: "2023",
    category: "The Rebranding",
    color: "yellow",
    side: "left",
    content: (
      <>
        Following organizational changes within the global Google Developer community, the
        organization officially rebranded as <strong>ADS</strong>, continuing its commitment to
        empowering students guided by Augustinian values:{" "}
        <strong>Caritas, Unitas, and Veritas</strong>.
      </>
    ),
  },
  {
    id: "excellence",
    year: "2025",
    category: "Award-Winning Excellence",
    color: "orange",
    side: "right",
    content: (
      <>
        Achieved a major milestone by winning the{" "}
        <strong>Best Augustinian Passion Project in Academic Excellence</strong> for the cybersecurity
        awareness project <em>“Unveiling the Dark Web and its Cyber Crime Mysteries”</em>.
      </>
    ),
  },
  {
    id: "impact",
    year: "2026",
    category: "Community Impact",
    color: "red",
    side: "left",
    content: (
      <>
        Expanded its reach and earned the{" "}
        <strong>SAWO Best Outreach Project Commendation</strong> and an{" "}
        <strong>Honorable Mention for Academic Excellence</strong> for the AI development outreach
        initiative, <em>“Digital Bayan”</em>.
      </>
    ),
  },
];

export function OurJourney() {
  return (
    <section className="journey-section" id="our-journey" aria-label="Our Journey">
      <div className="section-boundary-label">
        <Eyebrow>Milestones &amp; History</Eyebrow>
      </div>
      <div className="container">
        <div className="journey-header">
          <h2 className="journey-title">
            <span className="gradient-text">Our Journey</span>
          </h2>
          <div className="journey-subline" aria-hidden="true">
            <span className="journey-subline-bar" />
          </div>
        </div>

        <div className="journey-timeline">
          <div className="journey-items">

            {MILESTONES.map((milestone) => (
              <div
                key={milestone.id}
                className={`journey-item journey-item-${milestone.side} journey-item-${milestone.color}`}
              >
                <div className="journey-card-wrapper">
                  <div className="journey-card">
                    <span className={`journey-card-badge journey-badge-${milestone.color}`}>
                      {milestone.category}
                    </span>
                    <p className="journey-card-text">{milestone.content}</p>
                  </div>
                  <div className="journey-connector" aria-hidden="true" />
                </div>

                <div className="journey-center-node">
                  <span className={`journey-year-badge journey-badge-${milestone.color}`}>
                    {milestone.year}
                  </span>
                </div>

                <div className="journey-empty-slot" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
