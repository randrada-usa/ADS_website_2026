import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import {
  DepartmentCard,
  Eyebrow,
  PageIntro,
  ButtonLink,
} from "@/components/ui";
import { Spark } from "@/components/icons";
export const metadata: Metadata = { title: "About" };
export default async function AboutPage() {
  const content = await getContent();
  return (
    <>
      <PageIntro
        label="Hello, we’re ADS"
        title={
          <>
            Curious minds.
            <br />
            <span className="gradient-text">Shared purpose.</span>
          </>
        }
        description={content.settings.intro}
      />
      <section className="container section about-story">
        <div className="story-art" aria-hidden="true">
          <span>&lt;</span>
          <Spark />
          <span>/&gt;</span>
          <p>Made of different minds.</p>
        </div>
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h2>
            Rooted in community.
            <br />
            Looking forward.
          </h2>
          <p className="large-copy">
            {content.settings.about || "Our story will be shared here soon."}
          </p>
          {content.demo && (
            <p className="editorial-note">
              Draft organization copy · awaiting review
            </p>
          )}
          <ButtonLink href="/team" secondary>
            Meet the people
          </ButtonLink>
        </div>
      </section>
      <section className="container values-cards">
        <article>
          <span className="category">OUR MISSION</span>
          <h2>Why we’re here.</h2>
          <p>
            {content.settings.mission ||
              "Our mission statement will appear here once approved."}
          </p>
          <Spark />
        </article>
        <article>
          <span className="category">OUR VISION</span>
          <h2>Where we’re going.</h2>
          <p>
            {content.settings.vision ||
              "Our vision statement will appear here once approved."}
          </p>
          <Spark />
        </article>
      </section>
      <section id="departments" className="section container">
        <div className="center-heading">
          <Eyebrow>Our departments</Eyebrow>
          <h2>
            Everyone brings
            <br />
            <span className="underlined">something different.</span>
          </h2>
          <p>Meet the five departments that make ADS a collective effort.</p>
        </div>
        <div className="departments-grid">
          {content.departments.map((department, i) => (
            <DepartmentCard
              key={department.slug}
              department={department}
              number={i + 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
