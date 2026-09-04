import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { safeUrl } from "@/lib/utils";
import facebookIcon from "../../assets/socials/facebook-square-icon.svg";
import instagramIcon from "../../assets/socials/ig-instagram-icon.svg";
import linkedInIcon from "../../assets/socials/linkedin-app-icon.svg";
import tikTokIcon from "../../assets/socials/tiktok-rounded-square-icon.svg";

const platforms = ["Facebook", "LinkedIn", "Instagram", "TikTok"] as const;
type Platform = (typeof platforms)[number];
const platformUrls: Record<Platform, string> = {
  Facebook: "https://www.facebook.com/adsusadevs",
  LinkedIn:
    "https://www.linkedin.com/company/augustinian-developer-society-university-of-san-agustin/",
  Instagram: "https://www.instagram.com/ads.san_ag/",
  TikTok: "https://www.tiktok.com/@ads.san_ag",
};
const platformIcons = {
  Facebook: facebookIcon,
  LinkedIn: linkedInIcon,
  Instagram: instagramIcon,
  TikTok: tikTokIcon,
} satisfies Record<Platform, typeof facebookIcon>;

function SocialIcon({ platform }: { platform: Platform }) {
  return (
    <Image
      className="social-logo"
      src={platformIcons[platform]}
      alt=""
      width="20"
      height="20"
      aria-hidden="true"
    />
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
        const href = safeUrl(profile?.url) || platformUrls[platform];
        return href ? (
          <a
            key={platform}
            className="social-icon"
            data-platform={platform}
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
