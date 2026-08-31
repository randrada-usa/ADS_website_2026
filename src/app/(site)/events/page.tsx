import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { activityHref, formatDate, isUpcoming } from "@/lib/utils";
import { Eyebrow, PageIntro } from "@/components/ui";
import { ActivityBrowser } from "@/components/activity-browser";
import { Arrow } from "@/components/icons";
export const metadata: Metadata = { title: "Events" };
export default async function EventsPage() {
  const content = await getContent();
  const now = new Date().getTime();
  const events = content.activities.filter((item) => item.kind === "event");
  const featured =
    content.featuredEvents
      .map((id) => events.find((item) => item._id === id))
      .find(Boolean) ||
    [...events]
      .filter((item) => isUpcoming(item, now))
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))[0] ||
    events[0];
  return (
    <>
      <PageIntro
        label="Around the society"
        title={
          <>
            Show up curious.
            <br />
            <span className="gradient-text">Leave inspired.</span>
          </>
        }
        description="A space for learning, exchanging ideas, and making memories. See what’s ahead and what we’ve been up to."
      />
      <div className="container">
        {featured && (
          <Link href={activityHref(featured)} className="featured-event">
            {featured.image && (
              <Image
                src={featured.image}
                alt={featured.imageAlt || featured.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1152px"
                priority
              />
            )}
            <div className="featured-event-shade" />
            <div className="featured-event-content">
              <Eyebrow>
                {isUpcoming(featured, now) ? "Coming up" : "Latest recap"}
              </Eyebrow>
              <span className="featured-date">
                {formatDate(featured.date)}
                {featured.demo && " · Sample date"}
              </span>
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              <span className="button button-white">
                Explore the event
                <Arrow diagonal />
              </span>
            </div>
            {featured.demo && (
              <span className="photo-label">STOCK PHOTO · PLACEHOLDER</span>
            )}
          </Link>
        )}
      </div>
      <section className="container listing-section">
        {content.demo && (
          <p className="editorial-note">
            Preview collection · sample events and dates, not announcements
          </p>
        )}
        <ActivityBrowser activities={events} kind="event" now={now} />
      </section>
    </>
  );
}
