import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { Activity, SiteContent } from "@/lib/types";
import { formatDate, safeUrl } from "@/lib/utils";
import { ActivityCard, BackButton, SectionHeading } from "./ui";

export function ActivityDetail({
  activity,
  content,
}: {
  activity: Activity;
  content: SiteContent;
}) {
  const related = content.activities.filter((item) =>
    activity.related?.includes(item._id),
  );
  const fallbackHref =
    activity.kind === "event" ? "/initiatives#events" : "/initiatives";
  const labelText = `All ${activity.kind === "event" ? "events" : "initiatives"}`;
  return (
    <>
      <section className="container detail-intro">
        <div className="page-intro-back">
          <BackButton fallbackHref={fallbackHref}>
            {labelText}
          </BackButton>
        </div>
        <div className="card-meta">

          <span className="category">{activity.category}</span>
        </div>
        <h1>{activity.title}</h1>
        <p>{activity.summary}</p>
        {activity.image && (
          <div className="detail-cover">
            <Image
              src={activity.image}
              alt={activity.imageAlt || activity.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1152px"
              priority
            />
          </div>
        )}
      </section>
      <section className="container section detail-body">
        <div className="prose">
          {activity.body?.length ? (
            <PortableText
              value={activity.body}
              components={{
                marks: {
                  link: ({ value, children }) =>
                    safeUrl(value?.href) ? (
                      <a
                        href={safeUrl(value.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ) : (
                      <span>{children}</span>
                    ),
                },
              }}
            />
          ) : (
            <>
              <h2>The story behind it</h2>
              <p>
                More details about this activity will be shared soon.
              </p>
            </>
          )}
          {activity.outcome && (
            <>
              <h2>What it made possible</h2>
              <p>{activity.outcome}</p>
            </>
          )}
        </div>
        <aside className="detail-facts">
          <h3>A closer look</h3>
          <dl>
            <dt>Activity type</dt>
            <dd>{activity.category}</dd>
            {activity.date && (
              <>
                <dt>{activity.demo ? "Sample date" : "Date"}</dt>
                <dd>
                  {formatDate(activity.date)}
                  {activity.endDate && ` – ${formatDate(activity.endDate)}`}
                </dd>
              </>
            )}
            {activity.location && (
              <>
                <dt>Location</dt>
                <dd>{activity.location}</dd>
              </>
            )}
            {activity.role && (
              <>
                <dt>ADS’s role</dt>
                <dd>{activity.role}</dd>
              </>
            )}
          </dl>
        </aside>
      </section>
      {Boolean(activity.photos?.length) && (
        <div className="container supporting-photos">
          {activity
            .photos!.filter((photo) => photo.url)
            .map((photo, i) => (
              <figure key={i}>
                <div className="supporting-photo">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 650px) 100vw, 50vw"
                  />
                </div>
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
        </div>
      )}
      {related.length > 0 && (
        <section className="container section">
          <SectionHeading
            label="Keep exploring"
            title="Part of a bigger story."
          />
          <div className="activity-grid">
            {related.map((item) => (
              <ActivityCard key={item._id} activity={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
