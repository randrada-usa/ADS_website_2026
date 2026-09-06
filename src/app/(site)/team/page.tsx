import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { PageEntrance } from "@/components/page-entrance";
import { ExecutiveEntrance } from "@/components/executive-entrance";
import {
  DepartmentCard,
  EmptyState,
  Eyebrow,
  MemberCard,
  PageIntro,
  SectionHeading,
} from "@/components/ui";
export const metadata: Metadata = { title: "The Team" };
export default async function TeamPage() {
  const content = await getContent();
  const members = content.members
    .filter((item) => item.isLeadership)
    .sort(
      (a, b) =>
        Number(a.position.trim().toLowerCase() === "adviser") -
        Number(b.position.trim().toLowerCase() === "adviser"),
    );
  return (
    <>
      <PageEntrance />
      <PageIntro
        label="The people behind ADS"
        title={
          <>
            Different minds.
            <br />
            <span className="gradient-text">One amazing team.</span>
          </>
        }
        description="Meet the leadership bringing our community together and helping good ideas find their way."
        background={
          <div className="team-page-bg-intro" aria-hidden="true">
            <span className="team-intro-circle-right" />
            <span className="team-intro-satellite-teal" />
            <span className="team-intro-satellite-coral" />
            <span className="team-intro-circle-left" />
          </div>
        }
      >
        <div className="page-intro-addy team-addy-stage">
          <Image
            className="team-intro-addy"
            src="/assets/addy/addy-domination.png"
            alt="Addy, the ADS mascot"
            width={1440}
            height={1440}
            sizes="(max-width: 850px) 62vw, 36vw"
            loading="eager"
          />
          <div className="team-addy-callout" role="note">
            <span>Addy&apos;s Asserting Dominance</span>
            <svg aria-hidden="true" viewBox="0 0 90 58">
              <path d="M82 7C58 9 38 20 14 45" />
              <path d="m15 33-2 13 13-2" />
            </svg>
          </div>
        </div>
      </PageIntro>
      <ExecutiveEntrance
        id="team-roster"
        className="container listing-section team-listing"
      >
        <div className="team-roster-bg" aria-hidden="true">
          <span className="team-roster-circle-tr" />
          <span className="team-roster-circle-mr" />
          <span className="team-roster-satellite-2" />
        </div>
        <div className="section-boundary-label">
          <span
            className="separator-circle-accent separator-circle-teal"
            aria-hidden="true"
          />
          <Eyebrow>Executive Leadership</Eyebrow>
        </div>
        {members.length ? (
          <div className="member-grid">
            {members.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                color={
                  content.departments.find(
                    (dept) => dept.slug === member.department,
                  )?.color
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState>
            Our leadership roster will be shared here soon.
          </EmptyState>
        )}
      </ExecutiveEntrance>
      <section className="department-section section">
        <div className="department-background-art" aria-hidden="true">
          <span className="department-circle-top-left" />
        </div>
        <div className="section-boundary-label">
          <Eyebrow>How we work together</Eyebrow>
        </div>
        <div className="container">
          <SectionHeading
            label="More minds, more possibilities"
            title="Meet the departments."
            description="Get to know the people who help bring every part of ADS to life."
          />
          <div className="departments-grid">
            {content.departments.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
