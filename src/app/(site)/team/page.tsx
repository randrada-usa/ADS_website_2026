import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { PageEntrance } from "@/components/page-entrance";
import { ExecutiveEntrance } from "@/components/executive-entrance";
import addyDomination from "../../../../assets/addy/addy_domination.png";
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
        <Image
          className="page-intro-addy team-intro-addy"
          src={addyDomination}
          alt="Addy, the ADS mascot"
          sizes="(max-width: 850px) 62vw, 36vw"
          loading="eager"
        />
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
