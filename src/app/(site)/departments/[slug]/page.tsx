import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { departments } from "@/lib/demo";
import {
  EmptyState,
  Eyebrow,
  MemberCard,
  SectionHeading,
} from "@/components/ui";
import { DepartmentMemberScroll } from "@/components/department-member-scroll";
import { DepartmentScrollTop } from "@/components/department-scroll-top";
import { PageEntrance } from "@/components/page-entrance";
import { Arrow, BackArrowIcon } from "@/components/icons";
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
      id="top"
      className="department-page"
      style={{ "--department": dept.color } as CSSProperties}
    >
      <DepartmentScrollTop key={slug} />
      <PageEntrance key={`entrance-${slug}`} />
      <section className="container department-intro">
        <div className="page-intro-back">
          <Link href="/team#top" className="back-button">
            <BackArrowIcon className="back-button-icon" />
            <span className="back-button-text">All departments</span>
          </Link>
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
              width={360}
              height={360}
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
        {members.length > 0 && (
          <DepartmentMemberScroll
            key={slug}
            heading={
              <SectionHeading
                label="The people who make it happen"
                title="Meet the department."
              />
            }
          >
            {[...heads, ...roster].map((member) => (
              <div className="department-member-slide" key={member._id}>
                <div className="department-member-motion">
                  <MemberCard member={member} color={dept.color} />
                </div>
              </div>
            ))}
          </DepartmentMemberScroll>
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
            <Link key={item.slug} href={`/departments/${item.slug}#top`}>
              <Image
                className="department-link-logo"
                src={`/brand/${item.slug}.svg`}
                alt=""
                width={38}
                height={38}
              />
              {item.name}
              <Arrow diagonal />
            </Link>
          ))}
      </div>
    </div>
  );
}
