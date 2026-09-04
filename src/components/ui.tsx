import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Activity, Department, Member, SiteSettings } from "@/lib/types";
import { activityHref, formatDate, isUpcoming, safeEmail } from "@/lib/utils";
import { AdsMark, Arrow, CalendarIcon, LocationIcon, MailIcon, Spark } from "./icons";
import { SocialIcons } from "./social-icons";
import { BackButton } from "./back-button";

export { BackButton };


type ButtonTone = "blue" | "teal" | "yellow" | "orange" | "red";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`eyebrow ${className}`.trim()}>
      <AdsMark className="eyebrow-icon" />
      <span className="eyebrow-text">{children}</span>
    </span>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
  tone = "blue",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  tone?: ButtonTone;
}) {
  return (
    <Link
      href={href}
      className={`button${secondary ? " button-secondary" : ` button-${tone}`}`}
    >
      {children}
      <Arrow diagonal />
    </Link>
  );
}
export function SectionHeading({
  label,
  title,
  description,
  href,
  linkText,
  linkAsButton = false,
  linkTone = "blue",
}: {
  label?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  linkText?: string;
  linkAsButton?: boolean;
  linkTone?: ButtonTone;
}) {
  return (
    <div className="section-heading">
      <div>
        {label && <Eyebrow>{label}</Eyebrow>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href &&
        (linkAsButton ? (
          <ButtonLink href={href} tone={linkTone}>
            {linkText || "Explore more"}
          </ButtonLink>
        ) : (
          <Link className="text-link" href={href}>
            {linkText || "Explore more"}
            <Arrow diagonal />
          </Link>
        ))}
    </div>
  );
}
export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link
      className="department-card"
      href={`/departments/${department.slug}#top`}
      style={{ "--department": department.color } as CSSProperties}
    >
      <div className="department-card-header">
        <span className="department-card-badge">
          <Image
            src={`/brand/${department.slug}.svg`}
            alt=""
            width={70}
            height={70}
          />
        </span>
        <h3>{department.name}</h3>
      </div>
      <div className="department-card-body">
        <p>{department.purpose}</p>
      </div>
    </Link>
  );
}
export function ActivityCard({
  activity,
  compact = false,
}: {
  activity: Activity;
  compact?: boolean;
}) {
  return (
    <Link
      href={activityHref(activity)}
      className={`activity-card ${compact ? "compact" : ""}`}
    >
      <div className="activity-image">
        {activity.image ? (
          <Image
            src={activity.image}
            alt={activity.imageAlt || activity.title}
            fill
            sizes={
              compact
                ? "(max-width: 700px) 100vw, 45vw"
                : "(max-width: 700px) 100vw, 33vw"
            }
          />
        ) : (
          <div className="image-placeholder">
            <Spark />
            <span>Photo coming soon</span>
          </div>
        )}
        <span className="image-arrow">
          <Arrow diagonal />
        </span>
      </div>
      <div className="activity-copy">
        <div className="card-meta">
          <span className={`category category-${activity.kind}`}>
            {activity.category}
          </span>
        </div>
        <h3>{activity.title}</h3>
        <p>{activity.summary}</p>
        {activity.kind === "event" && (
          <div className="event-meta">
            <span>
              <CalendarIcon />
              {formatDate(activity.date)}
            </span>
            {activity.location && (
              <span>
                <LocationIcon />
                {activity.location}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
export function MemberCard({
  member,
  color = "#3C6597",
}: {
  member: Member;
  color?: string;
}) {
  return (
    <article
      className="member-card"
      style={{ "--department": color } as CSSProperties}
    >
      <div className="member-portrait">
        {member.portrait ? (
          <Image
            src={member.portrait}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(max-width: 600px) 45vw, 25vw"
          />
        ) : (
          <svg
            viewBox="0 0 240 220"
            role="img"
            aria-label="Portrait placeholder"
          >
            <circle cx="120" cy="86" r="37" />
            <path d="M41 220v-20a79 79 0 0 1 158 0v20" />
          </svg>
        )}
      </div>
      <div className="member-copy">
        <h3>{member.name}</h3>
        <p>{member.position}</p>
      </div>
    </article>
  );
}
export function PageIntro({
  label,
  title,
  description,
  children,
  showBack = true,
  backHref = "/",
  backLabel = "Back",
}: {
  label: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="page-intro container">
      {showBack && (
        <div className="page-intro-back">
          <BackButton fallbackHref={backHref}>{backLabel}</BackButton>
        </div>
      )}
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
      <Spark className="intro-spark" />
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="empty-state">
      <Spark />
      <p>{children}</p>
    </div>
  );
}
export function Footer({
  settings,
  activities,
}: {
  settings: SiteSettings;
  activities: Activity[];
}) {
  const email = safeEmail(settings.email) || "ads@usa.edu.ph";
  const now = new Date().getTime();
  const upcomingEvents = activities
    .filter((item) => item.kind === "event" && isUpcoming(item, now))
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .slice(0, 3);

  return (
    <footer id="contact" className="site-footer">
      <div className="color-stripe" />
      <div className="container footer-shell">
        <div className="footer-grid">
          <section className="footer-brand-block" aria-labelledby="footer-brand">
            <div className="footer-brand-lockup">
              <Image src="/brand/ads.svg" width={130} height={108} alt="" />
              <div>
                <h2 id="footer-brand">Augustinian Developer Society</h2>
                <p>University of San Agustin</p>
              </div>
            </div>
            <div className="footer-socials">
              <SocialIcons socials={settings.socials} />
            </div>
          </section>

          <nav className="footer-column" aria-labelledby="footer-links-title">
            <h2 id="footer-links-title">Quick Links</h2>
            <div className="footer-nav-links">
              <Link href="/about">About</Link>
              <Link href="/initiatives">What We Do</Link>
              <Link href="/initiatives#events">Events</Link>
              <Link href="/team">Team</Link>
              <Link href="/#faq">FAQ</Link>
            </div>
          </nav>

          <section
            className="footer-column footer-events-column"
            aria-labelledby="footer-events-title"
          >
            <h2 id="footer-events-title">Upcoming Events</h2>
            {upcomingEvents.length ? (
              <div className="footer-event-list">
                {upcomingEvents.map((event) => (
                  <Link href={activityHref(event)} key={event._id}>
                    <span className="footer-event-dot" aria-hidden="true" />
                    <span>
                      <strong>{event.title}</strong>
                      <small>{formatDate(event.date)}</small>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="footer-events-empty">
                <p>New experiences are always taking shape.</p>
                <Link href="/initiatives#events" className="text-link">
                  Explore events <Arrow diagonal />
                </Link>
              </div>
            )}
          </section>

          <section className="footer-column footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">Contact</h2>
            <div className="footer-contact-list">
              {email ? (
                <a href={`mailto:${email}`} className="footer-contact-row">
                  <MailIcon />
                  {email}
                </a>
              ) : (
                <p className="footer-contact-row footer-contact-pending">
                  <MailIcon />
                  Official email coming soon
                </p>
              )}
              <span className="footer-contact-row">
                <LocationIcon />
                <span className="footer-location-copy">
                  <span>University of San Agustin</span>
                </span>
              </span>
            </div>
          </section>
        </div>
        <div className="footer-credits" aria-label="Website credits">
          <span>© {new Date().getFullYear()} Augustinian Developer Society. All rights reserved.</span>
          <span className="footer-credit-links">
            <a href="https://github.com/randrada-usa" target="_blank" rel="noreferrer">
              @reyands
            </a>
            <a href="https://github.com/Cocoasaur" target="_blank" rel="noreferrer">
              @jlcoco
            </a>
            <a
              href="https://github.com/Alexander-Tolosa"
              target="_blank"
              rel="noreferrer"
            >
              @alexander
            </a>
            <a
              href="https://www.facebook.com/beatrice.sanda.7/"
              target="_blank"
              rel="noreferrer"
            >
              @Bea_Trice
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
