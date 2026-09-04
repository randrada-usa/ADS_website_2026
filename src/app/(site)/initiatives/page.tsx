import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { activityHref, formatDate, isUpcoming } from "@/lib/utils";
import { Eyebrow, PageIntro } from "@/components/ui";
import { ActivityBrowser } from "@/components/activity-browser";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = { title: "Initiatives & Events" };

export default async function InitiativesPage() {
  const content = await getContent();
  const now = new Date().getTime();
  const events = content.activities.filter((item) => item.kind === "event");
  const activities = content.activities.filter(
    (item) => item.kind === "initiative" || item.kind === "event",
  );
  const featuredEvent =
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
        label="What we do, together"
        title={
          <>
            Ideas with intention.
            <br />
            <span className="gradient-text">Action with purpose.</span>
          </>
        }
        description="Outreach, shared experiences, and connections beyond campus. This is what putting our curiosity to work looks like."
      />
      <section id="events" className="container">
        {featuredEvent && (
          <Link href={activityHref(featuredEvent)} className="featured-event">
            {featuredEvent.image && (
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.imageAlt || featuredEvent.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1152px"
              />
            )}
            <div className="featured-event-shade" />
            <div className="featured-event-content">
              <Eyebrow>
                {isUpcoming(featuredEvent, now)
                  ? "HAPPENING NOW"
                  : "Latest recap"}
              </Eyebrow>
              <span className="featured-date">
                {formatDate(featuredEvent.date)}
                {featuredEvent.demo && " · Sample date"}
              </span>
              <h2>{featuredEvent.title}</h2>
              <p>{featuredEvent.summary}</p>
              <span className="button button-white">
                Explore the event
                <Arrow diagonal />
              </span>
            </div>
          </Link>
        )}
      </section>
      <section id="initiatives" className="container listing-section">
        <ActivityBrowser activities={activities} kind="all" now={now} />
      </section>
    </>
  );
}
