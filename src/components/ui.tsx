import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Activity, Department, Member, SiteSettings } from "@/lib/types";
import { activityHref, formatDate, safeEmail, safeUrl } from "@/lib/utils";
import { Arrow, CalendarIcon, LocationIcon, Spark } from "./icons";
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span aria-hidden="true">&lt;/&gt;</span>
      {children}
    </span>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : ""}`}
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
}: {
  label?: string;
  title: ReactNode;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {label && <Eyebrow>{label}</Eyebrow>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText || "Explore more"}
          <Arrow diagonal />
        </Link>
      )}
    </div>
  );
}
export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link
      className="department-card"
      href={`/departments/${department.slug}`}
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
        {activity.demo && (
          <span className="photo-label">STOCK PHOTO · PLACEHOLDER</span>
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
          {activity.demo && <span className="demo-label">Sample content</span>}
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
}: {
  label: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-intro container">
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
  demo,
}: {
  settings: SiteSettings;
  demo: boolean;
}) {
  const email = safeEmail(settings.email);
  const socials = settings.socials.filter((item) => safeUrl(item.url));
  return (
    <footer id="contact" className="site-footer">
      <div className="color-stripe" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-identity">
            <Image src="/brand/ads.svg" width={130} height={108} alt="" />
            <div>
              <h2>Augustinian Developer Society</h2>
              <p>University of San Agustin</p>
            </div>
          </div>
          <div className="footer-contact">
            {email ? (
              <a href={`mailto:${email}`} className="contact-email">
                {email}
                <Arrow diagonal />
              </a>
            ) : (
              <p className="contact-pending">
                Official contact details coming soon.
                <br />
                <span>Links will appear here once verified.</span>
              </p>
            )}
            <div className="social-links">
              {socials.map((item) => (
                <a
                  key={item.url}
                  href={safeUrl(item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                  <Arrow diagonal />
                </a>
              ))}
            </div>
            <span className="footer-location">
              <LocationIcon />
              University of San Agustin · Iloilo, Philippines
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/initiatives">Initiatives</Link>
            <Link href="/events">Events</Link>
            <Link href="/team">Team</Link>
            <Link href="/#faq">FAQ</Link>
          </div>
        </div>
        <div className="footer-colophon">
          <span>
            © {new Date().getFullYear()} Augustinian Developer Society.
          </span>
          <span>
            Built with curiosity. Made for community.
            <Spark className="tiny-star" />
          </span>
        </div>
        {demo && (
          <p className="demo-notice">
            DESIGN PREVIEW — Activity details, dates, roster, and copy are
            placeholders awaiting review. Stock photography does not depict ADS.
          </p>
        )}
      </div>
    </footer>
  );
}
