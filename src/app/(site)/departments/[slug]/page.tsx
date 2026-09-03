import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { departments } from "@/lib/demo";
import {
  BackButton,
  EmptyState,
  Eyebrow,
  MemberCard,
  SectionHeading,
} from "@/components/ui";
import { Arrow } from "@/components/icons";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return departments.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = departments.find((item) => item.slug === slug);
  return { title: dept ? `${dept.name} Department` : "Department not found" };
}
export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const dept = content.departments.find((item) => item.slug === slug);
  if (!dept) notFound();
  const members = content.members.filter((item) => item.department === slug);
  const heads = members.filter((item) => item.isHead);
  const roster = members.filter((item) => !item.isHead);
  return (
    <div
      className="department-page"
      style={{ "--department": dept.color } as CSSProperties}
    >
      <section className="container department-intro">
        <div className="page-intro-back">
          <BackButton fallbackHref="/#departments">
            All departments
          </BackButton>
        </div>
        <div className="department-hero">
          <div>
            <Eyebrow>Five departments. One society.</Eyebrow>

            <h1>
              {dept.name}
              <span>Department</span>
            </h1>
            <p>
              {dept.purpose || "Get to know our department and its people."}
            </p>
          </div>
          <div className="department-emblem">
            <Image
              src={`/brand/${slug}.svg`}
              alt={`${dept.name} department emblem`}
              width={200}
              height={200}
            />
          </div>
        </div>
      </section>
      {dept.responsibilities.length > 0 && (
        <section className="responsibilities">
          <div className="container">
            <span>WHAT WE BRING</span>
            {dept.responsibilities.map((item, i) => (
              <p key={i}>
                <span>0{i + 1}</span>
                {item}
              </p>
            ))}
          </div>
        </section>
      )}
      <section className="container section">
        <SectionHeading
          label="The people who make it happen"
          title="Meet the department."
        />
        {heads.length > 0 && (
          <div className="department-heads">
            <h3 className="roster-label">Department leadership</h3>
            <div className="member-grid">
              {heads.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  color={dept.color}
                />
              ))}
            </div>
          </div>
        )}
        {roster.length > 0 && (
          <>
            <h3 className="roster-label">Our members</h3>
            <div className="member-grid">
              {roster.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  color={dept.color}
                />
              ))}
            </div>
          </>
        )}
        {members.length === 0 && (
          <EmptyState>Our department roster will appear here soon.</EmptyState>
        )}
      </section>
      <div className="container department-links">
        <span>Explore the other departments</span>
        {content.departments
          .filter((item) => item.slug !== slug)
          .map((item) => (
            <Link key={item.slug} href={`/departments/${item.slug}`}>
              {item.name}
              <Arrow diagonal />
            </Link>
          ))}
      </div>
    </div>
  );
}
