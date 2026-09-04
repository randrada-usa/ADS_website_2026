import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageEntrance } from "@/components/page-entrance";
import { ExecutiveEntrance } from "@/components/executive-entrance";
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
      />
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
