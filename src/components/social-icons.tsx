import type { SiteSettings } from "@/lib/types";
import { safeUrl } from "@/lib/utils";

const platforms = ["Facebook", "LinkedIn", "Instagram", "TikTok"] as const;
type Platform = (typeof platforms)[number];

function SocialIcon({ platform }: { platform: Platform }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {platform === "Facebook" && (
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
      )}
      {platform === "LinkedIn" && (
        <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-5.1c0-1.3-.5-2.1-1.6-2.1-1.2 0-1.9.8-1.9 2.1V19h-3V9h2.9v1.4c.5-.9 1.5-1.7 3-1.7 2.2 0 3.6 1.5 3.6 4.4Z" />
      )}
      {platform === "Instagram" && (
        <g fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </g>
      )}
      {platform === "TikTok" && (
        <path d="M16.7 2c.3 2.5 1.7 4 4.3 4.3v3.4a9 9 0 0 1-4.3-1.3v7.3a6.3 6.3 0 1 1-5.4-6.2v3.5a2.9 2.9 0 1 0 2 2.7V2Z" />
      )}
    </svg>
  );
}

export function SocialIcons({ socials }: { socials: SiteSettings["socials"] }) {
  return (
    <div className="nav-socials" role="group" aria-label="ADS social profiles">
      {platforms.map((platform) => {
        const profile = socials.find(
          (social) =>
            social.label.trim().toLowerCase() === platform.toLowerCase(),
        );
        const href = safeUrl(profile?.url);
        return href ? (
          <a
            key={platform}
            className="social-icon"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`ADS on ${platform} (opens in a new tab)`}
            title={platform}
          >
            <SocialIcon platform={platform} />
          </a>
        ) : (
          <span
            key={platform}
            className="social-icon social-placeholder"
            role="img"
            aria-label={`${platform} — link coming soon`}
            title={`${platform} — link coming soon`}
          >
            <SocialIcon platform={platform} />
          </span>
        );
      })}
    </div>
  );
}
