import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import {
  ButtonLink,
  DepartmentCard,
  EmptyState,
  Eyebrow,
  MemberCard,
  SectionHeading,
} from "@/components/ui";
import { Arrow, Spark } from "@/components/icons";
import { ValuesMarquee } from "@/components/values-marquee";
import { FaqAccordion } from "@/components/faq-accordion";
import { InitiativeShowcase } from "@/components/initiative-showcase";
import { OurJourney } from "@/components/our-journey";
import { HeroMotion } from "@/components/hero-motion";
import { InitiativeEntrance } from "@/components/initiative-entrance";
import { ExecutiveEntrance } from "@/components/executive-entrance";
import { safeEmail } from "@/lib/utils";

const featuredEventTitles: Record<string, string> = {
  "a-place-to-start-building": "Start Building",
  "connecting-curious-minds": "Curious Minds",
  "an-idea-worth-building": "Build for Community",
};

const homepageExecutivePositions = [
  "Chief Executive Officer",
  "Co-Chief Executive Officer",
  "Executive Secretary",
  "Assistant Executive Secretary",
];

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
    .slice(0, 3);
  const members = homepageExecutivePositions
    .map((position) =>
      content.members.find(
        (member) =>
          member.isLeadership &&
          member.position.trim().toLowerCase() === position.toLowerCase(),
      ),
    )
    .filter((member) => member != null);
  const contactEmail = safeEmail(content.settings.email) || "ads@usa.edu.ph";
  return (
    <>
      <HeroMotion>
        <div className="hero-background-design" aria-hidden="true">
          <span className="hero-bg-circle hero-bg-circle-top-left" />
          <span className="hero-bg-circle hero-bg-circle-top-right" />
          <svg
            className="hero-bg-contours hero-bg-contours-top"
            viewBox="0 0 620 410"
          >
            <path d="M170-32C119 28 65 83 76 141c13 68 122 43 205 46 94 3 130 30 147 96 14 56 52 84 126 96" />
            <path d="M244-39C189 25 119 89 131 125c13 40 109 9 211 26 117 20 119 81 146 145 19 45 56 67 118 73" />
            <path d="M312-35C259 21 178 83 185 109c8 30 113-1 222 35 111 37 93 116 150 171 20 20 42 32 68 38" />
          </svg>
        </div>
        <div className="hero-copy">
          <h1>
            <span className="hero-line-one">Augustinian</span>
            <span className="hero-line-two">
              <span className="hero-line-offset" aria-hidden="true">
                Ag
              </span>
              Developer
            </span>
            <span className="hero-line-three">
              <span className="hero-society-word">
                Society<span className="coral-dot">.</span>
              </span>
              <span
                className="small-department-icons hero-title-icons"
                aria-hidden="true"
              >
                {content.departments.map((dept) => (
                  <Image
                    key={dept.slug}
                    src={`/brand/${dept.slug}.svg`}
                    width={32}
                    height={32}
                    alt=""
                  />
                ))}
              </span>
            </span>
          </h1>
          <p className="university">University of San Agustin</p>
          <span
            className="small-department-icons hero-mobile-icons"
            aria-hidden="true"
          >
            {content.departments.map((dept) => (
              <Image
                key={dept.slug}
                src={`/brand/${dept.slug}.svg`}
                width={32}
                height={32}
                alt=""
              />
            ))}
          </span>
          <div className="hero-actions">
            <ButtonLink href="/initiatives">Our work</ButtonLink>
            <ButtonLink href={`mailto:${contactEmail}`} secondary>
              Contact Us
            </ButtonLink>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-logo-group">
            <span className="hero-orbit orbit-one" />
            <span className="hero-orbit orbit-two" />
            <div className="logo-disc">
              <Image
                className="hero-logo"
                src="/brand/ads.svg"
                alt=""
                width={260}
                height={216}
                priority
              />
            </div>
          </div>
          <span className="hero-circle teal-circle" />
          <Spark className="hero-spark" />
          <span className="floating-label label-build">
            &lt; let’s build /&gt;
          </span>
          <span className="floating-label label-impact">
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
      </HeroMotion>
      <ValuesMarquee />
      <section id="about-home" className="section container about-preview">
        <div className="about-background-design" aria-hidden="true">
          <span className="about-bg-circle about-bg-circle-upper-left" />
          <span className="about-bg-circle about-bg-circle-upper-right" />
          <svg
            className="about-bg-contours about-bg-contours-lower-right"
            viewBox="0 0 420 360"
          >
            <path d="M62 390c-38-93-22-159 52-204 65-40 126-16 198-71 49-38 78-83 98-135" />
            <path d="M119 390c-37-79-19-134 45-171 62-35 117-13 177-61 43-34 68-75 86-123" />
            <path d="M176 390c-33-65-14-108 39-137 56-31 104-10 154-51 35-29 56-64 72-105" />
          </svg>
        </div>
        <div className="about-mobile-label">
          <Eyebrow>About Us</Eyebrow>
        </div>
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
            <div className="photo-caption">
              <span>Good ideas start with good people.</span>
              <Spark />
            </div>
          </div>
          <span className="photo-sticker" data-float>
            made of
            <br />
            <strong>curiosity.</strong>
          </span>
        </div>
        <div className="about-copy">
          <Eyebrow>About Us</Eyebrow>
          <h2>
            More than an org.
            <br />
            <span className="underlined">A place to belong.</span>
          </h2>
          <p className="large-copy">{content.settings.intro}</p>
          {content.settings.introSupporting && (
            <p>{content.settings.introSupporting}</p>
          )}
          <ButtonLink href="/about" tone="red">
            Learn more about ADS
          </ButtonLink>
        </div>
      </section>
      <OurJourney />
      <InitiativeEntrance>
        {initiatives.length ? (
          <>
            <div className="section-boundary-label">
              <Eyebrow>Initiatives in action</Eyebrow>
            </div>
            <InitiativeShowcase activities={initiatives} />
          </>
        ) : (
          <EmptyState>Our initiative stories are on their way.</EmptyState>
        )}
      </InitiativeEntrance>
      <section
        id="events-home"
        className="section container events-home-section"
      >
        <div className="events-background-circles" aria-hidden="true">
          <span className="events-circle events-circle-top-right" />
          <span className="events-circle events-circle-top-satellite" />
          <span className="events-circle events-circle-bottom-middle" />
        </div>
        <div className="section-boundary-label">
          <Eyebrow>Around the society</Eyebrow>
        </div>
        <SectionHeading
          title="Where ideas come alive."
          description="Upcoming experiences and moments worth looking back on."
          href="/initiatives#events"
          linkText="Explore events"
          linkAsButton
          linkTone="blue"
        />
        {events.length ? (
          <div className="events-home-grid">
            {events.map((activity) => (
              <Link
                className="event-feature-card"
                href={`/events/${activity.slug}`}
                key={activity._id}
              >
                <h3>{featuredEventTitles[activity.slug] || activity.title}</h3>
                <div className="event-feature-photo">
                  {activity.image ? (
                    <Image
                      src={activity.image}
                      alt={activity.imageAlt || activity.title}
                      fill
                      sizes="(max-width: 650px) 90vw, 30vw"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <Spark />
                      <span>Photo coming soon</span>
                    </div>
                  )}
                </div>
                <p>{activity.summary}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState>New events and recaps will appear here.</EmptyState>
        )}
        <div className="responsive-section-action">
          <ButtonLink href="/initiatives#events" tone="blue">
            Explore events
          </ButtonLink>
        </div>
      </section>
      <ExecutiveEntrance>
        <div className="team-background-circles" aria-hidden="true">
          <span className="team-circle team-circle-top-right" />
          <span className="team-circle team-circle-right" />
        </div>
        <div className="section-boundary-label">
          <span
            className="separator-circle-accent separator-circle-teal"
            aria-hidden="true"
          />
          <Eyebrow>The people behind ADS</Eyebrow>
        </div>
        <div className="container">
          <SectionHeading
            title={
              <>
                A shared vision.
                <br />A whole lot of heart.
              </>
            }
            href="/team"
            linkText="Meet the team"
            linkAsButton
            linkTone="teal"
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
          <div className="responsive-section-action">
            <ButtonLink href="/team" tone="teal">
              Meet the team
            </ButtonLink>
          </div>
        </div>
      </ExecutiveEntrance>
      <section id="departments" className="department-section section">
        <div className="department-background-art" aria-hidden="true">
          <svg
            className="department-topo department-topo-upper"
            viewBox="0 0 620 410"
          >
            <path d="M170-32C119 28 65 83 76 141c13 68 122 43 205 46 94 3 130 30 147 96 14 56 52 84 126 96" />
            <path d="M244-39C189 25 119 89 131 125c13 40 109 9 211 26 117 20 119 81 146 145 19 45 56 67 118 73" />
            <path
              transform="translate(0 -18)"
              d="M312-35C259 21 178 83 185 109c8 30 113-1 222 35 111 37 93 116 150 171 20 20 42 32 68 38"
            />
          </svg>
          <svg
            className="department-topo department-topo-lower"
            viewBox="0 -30 460 440"
          >
            <path d="M62 390c-38-93-22-159 52-204 65-40 126-16 198-71 49-38 78-83 98-135" />
            <path d="M119 390c-37-79-19-134 45-171 62-35 117-13 177-61 43-34 68-75 86-123" />
            <path d="M176 390c-33-65-14-108 39-137 56-31 104-10 154-51 35-29 56-64 72-105" />
          </svg>
          <span className="department-circle-top-left" />
        </div>
        <div className="section-boundary-label">
          <Eyebrow>How we work together</Eyebrow>
        </div>
        <div className="container">
          <div className="center-heading">
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
            {content.departments.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className="section container faq-section">
        <div className="faq-background-circles" aria-hidden="true">
          <span className="faq-circle faq-circle-left" />
          <span className="faq-circle faq-circle-upper-right" />
          <span className="faq-circle faq-circle-lower-right" />
        </div>
        <div className="section-boundary-label">
          <span className="separator-circle-accent separator-circle-orange" />
          <Eyebrow>A little more about us</Eyebrow>
        </div>
        <div className="faq-heading">
          <h2>
            Curious?
            <br />
            <span className="gradient-text">You’re in good company.</span>
          </h2>
          <p>A few things you might be wondering.</p>
        </div>
        {content.faqs.length ? (
          <FaqAccordion faqs={content.faqs} />
        ) : (
          <p>Answers to common questions are coming soon.</p>
        )}
      </section>
    </>
  );
}
