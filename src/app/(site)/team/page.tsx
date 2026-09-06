import type { Metadata } from "next";
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
  const rosterMembers = [
    ...members,
    {
      _id: "addy-mascot",
      name: "Addy",
      position: "ADS Mascot",
      portrait: addyDomination.src,
      isLeadership: true,
    },
  ];
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
      />
      <ExecutiveEntrance
        id="team-roster"
        className="container listing-section team-listing"
      >
        <div className="team-roster-bg" aria-hidden="true">
          <span className="team-roster-circle-tr" />
          <span className="team-roster-circle-mr" />
          <span className="team-roster-satellite-2" />
        </div>
        {rosterMembers.length ? (
          <div className="member-grid">
            {rosterMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                className={member._id === "addy-mascot" ? "member-card-addy" : undefined}
                color={
                  content.departments.find(
                    (dept) => dept.slug === member.department,
                  )?.color ?? (member._id === "addy-mascot" ? "#F2BA5E" : undefined)
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
      <section className="department-section team-department-section section">
        <div className="department-background-art" aria-hidden="true">
          <span className="department-circle-top-left" />
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
