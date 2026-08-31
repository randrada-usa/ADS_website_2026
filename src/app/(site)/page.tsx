import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import {
  ActivityCard,
  ButtonLink,
  DepartmentCard,
  EmptyState,
  Eyebrow,
  MemberCard,
  SectionHeading,
} from "@/components/ui";
import { Arrow, Spark } from "@/components/icons";
import { ValuesMarquee } from "@/components/values-marquee";
export default async function Home() {
  const content = await getContent();
  const initiatives = content.featuredInitiatives
    .map((id) =>
      content.activities.find(
        (item) => item._id === id && item.kind === "initiative",
      ),
    )
    .filter((item) => item != null)
    .slice(0, 3);
  const events = content.featuredEvents
    .map((id) =>
      content.activities.find(
        (item) => item._id === id && item.kind === "event",
      ),
    )
    .filter((item) => item != null)
    .slice(0, 2);
  const members = content.members
    .filter((member) => member.isLeadership)
    .slice(0, 4);
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <h1>
            <span className="hero-line-one">Augustinian</span>
            <span className="hero-line-two">Developer</span>
            <span className="hero-line-three">
              Society<span className="coral-dot">.</span>
            </span>
          </h1>
          <p className="university">University of San Agustin</p>
          <p className="hero-description">{content.settings.heroDescription}</p>
          <div className="hero-actions">
            <ButtonLink href="/initiatives">Explore our work</ButtonLink>
            <ButtonLink href="/about" secondary>
              Get to know ADS
            </ButtonLink>
          </div>
          <div className="hero-footnote">
            <span className="small-department-icons">
              {content.departments.map((dept) => (
                <Image
                  key={dept.slug}
                  src={`/brand/${dept.slug}.svg`}
                  width={26}
                  height={26}
                  alt=""
                />
              ))}
            </span>
            <span>Different strengths. One society.</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit orbit-one" />
          <span className="hero-orbit orbit-two" />
          <span className="hero-circle teal-circle" />
          <Spark className="hero-spark" />
          <div className="logo-disc">
            <span className="disc-top">IDEAS. PEOPLE. POSSIBILITIES.</span>
            <Image
              className="hero-logo"
              src="/brand/ads.svg"
              alt=""
              width={226}
              height={223}
              priority
            />
            <span className="disc-bottom">
              BUILD WITH PURPOSE <Spark />
            </span>
          </div>
          <span className="floating-label label-build" data-float>
            &lt; let’s build /&gt;
          </span>
          <span className="floating-label label-impact" data-float>
            ideas <Arrow /> impact
          </span>
          <svg className="hand-arrow" viewBox="0 0 130 80">
            <path
              d="M5 10c10 45 47 55 109 35m-19-10 22 9-14 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="art-caption">
            A little curiosity goes a long way.
          </span>
        </div>
      </section>
      <ValuesMarquee />
      <section className="section container about-preview">
        <div className="about-image-wrap">
          <div className="photo-frame">
            <div className="about-photo">
              {initiatives[0]?.image || content.demo ? (
                <Image
                  src={initiatives[0]?.image || "/images/teamwork.jpg"}
                  alt={
                    initiatives[0]?.imageAlt ||
                    "Temporary stock photograph of people collaborating, not ADS members"
                  }
                  fill
                  sizes="(max-width: 800px) 100vw, 45vw"
                />
              ) : (
                <div className="image-placeholder">
                  <Spark />
                </div>
              )}
            </div>
            {content.demo && (
              <span className="photo-label">STOCK PHOTO · PLACEHOLDER</span>
            )}
            <div className="photo-caption">
              <span>Good ideas start with good people.</span>
              <Spark />
            </div>
          </div>
          <span className="photo-sticker">
            made of
            <br />
            <strong>curiosity.</strong>
          </span>
        </div>
        <div className="about-copy">
          <Eyebrow>Who we are</Eyebrow>
          <h2>
            More than an org.
            <br />
            <span className="underlined">A place to belong.</span>
          </h2>
          <p className="large-copy">{content.settings.intro}</p>
          {content.settings.introSupporting && (
            <p>{content.settings.introSupporting}</p>
          )}
          <Link href="/about" className="text-link">
            This is ADS
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section
        className="mission-vision-section"
        aria-label="Mission and vision"
      >
        <div className="container values-cards">
          <article>
            <h2>Our mission</h2>
            <p>
              {content.settings.mission ||
                "Placeholder: Our official mission statement will be added here after review."}
            </p>
            <Spark />
          </article>
          <article>
            <h2>Our vision</h2>
            <p>
              {content.settings.vision ||
                "Placeholder: Our official vision statement will be added here after review."}
            </p>
            <Spark />
          </article>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="Our initiatives"
          title={
            <>
              Good ideas.
              <br />
              <span className="gradient-text">Real-world purpose.</span>
            </>
          }
          description="A closer look at what we do, together."
          href="/initiatives"
          linkText="All initiatives"
        />
        {initiatives.length ? (
          <div className="activity-grid">
            {initiatives.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState>Our initiative stories are on their way.</EmptyState>
        )}
      </section>
      <section className="department-section section">
        <div className="container">
          <div className="center-heading">
            <Eyebrow>Find the people behind the ideas</Eyebrow>
            <h2>
              Five departments.
              <br />
              <span className="underlined">One shared purpose.</span>
            </h2>
            <p>
              Different talents, connected by the same drive to make a
              difference.
            </p>
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
          <p className="department-note">
            <span>↳</span> Each a little different. Better together.
          </p>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          label="Around the society"
          title="Where ideas come alive."
          description="Upcoming experiences and moments worth looking back on."
          href="/events"
          linkText="Explore events"
        />
        {events.length ? (
          <div className="events-home-grid">
            {events.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} compact />
            ))}
          </div>
        ) : (
          <EmptyState>New events and recaps will appear here.</EmptyState>
        )}
      </section>
      <section className="team-preview section">
        <div className="container">
          <SectionHeading
            label="The people behind ADS"
            title={
              <>
                A shared vision.
                <br />A whole lot of heart.
              </>
            }
            href="/team"
            linkText="Meet the team"
          />
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
            <EmptyState>Meet our leadership here soon.</EmptyState>
          )}
        </div>
      </section>
      <section id="faq" className="section container faq-section">
        <div>
          <Eyebrow>A little more about us</Eyebrow>
          <h2>
            Curious?
            <br />
            <span className="gradient-text">You’re in good company.</span>
          </h2>
          <p>A few things you might be wondering.</p>
          <Spark className="faq-spark" />
        </div>
        <div className="faq-list">
          {content.faqs.length ? (
            content.faqs.map((faq, i) => (
              <details key={faq._id}>
                <summary>
                  <span className="faq-index">0{i + 1}</span>
                  {faq.question}
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="faq-answer">
                  {content.demo && (
                    <span className="demo-label">
                      Draft answer · awaiting review
                    </span>
                  )}
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))
          ) : (
            <p>Answers to common questions are coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
