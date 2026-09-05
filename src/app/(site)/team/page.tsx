import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { PageEntrance } from "@/components/page-entrance";
import { ExecutiveEntrance } from "@/components/executive-entrance";
import addyDomination from "../../../../assets/addy/addy_domination.png";
import {
  DepartmentCard,
  EmptyState,
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
      >
        <div className="page-intro-addy team-addy-stage">
          <Image
            className="team-intro-addy"
            src={addyDomination}
            alt="Addy, the ADS mascot"
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
      <section className="container section">
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
      </section>
    </>
  );
}
