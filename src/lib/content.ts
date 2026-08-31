import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { createClient } from "next-sanity";
import { departments, demoContent } from "./demo";
import type { SiteContent } from "./types";

export const cmsConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);
export const sanityClient = cmsConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2026-08-01",
      useCdn: false,
      stega: {
        studioUrl: "/studio",
        filter: (context) => {
          // Keep machine-readable values unchanged in draft previews.
          const field = String(context.sourcePath.at(-1));
          if (
            [
              "_id",
              "_ref",
              "kind",
              "slug",
              "current",
              "category",
              "email",
              "url",
              "date",
              "endDate",
            ].includes(field)
          )
            return false;
          return context.filterDefault(context);
        },
      },
    })
  : null;
export const isPreview = async () =>
  cmsConfigured && (await draftMode()).isEnabled;

const query = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{heroDescription, intro, introSupporting, about, mission, vision, email, "socials": coalesce(socials, [])},
  "departments": *[_type == "department"]{"slug": slug.current, purpose, responsibilities},
  "members": *[_type == "member"] | order(order asc, name asc){_id, name, position, "department": department->slug.current, "portrait": portrait.asset->url, isHead, isLeadership, order},
  "activities": *[_type == "activity"] | order(date desc){_id, kind, "slug": slug.current, title, summary, category, "image": image.asset->url, "imageAlt": image.alt, date, endDate, location, role, outcome, body, "photos": photos[]{"url": asset->url, alt, caption}, "related": related[]._ref},
  "faqs": *[_type == "faq"] | order(order asc){_id, question, answer},
  "homepage": *[_type == "homepage" && _id == "homepage"][0]{"initiatives": featuredInitiatives[]._ref, "events": featuredEvents[]._ref}
}`;
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!sanityClient) return demoContent;
  const preview = await isPreview();
  const token = preview ? process.env.SANITY_API_READ_TOKEN : undefined;
  if (preview && !token)
    throw new Error(
      "Draft preview requires a server-only Sanity Viewer token.",
    );
  const data = await sanityClient.fetch(
    query,
    {},
    {
      perspective: preview ? "drafts" : "published",
      token,
      stega: preview,
      ...(preview
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60, tags: ["sanity-content"] } }),
    },
  );
  return {
    demo: false,
    settings: {
      heroDescription:
        "A community of curious minds at the University of San Agustin.",
      intro: "Get to know the Augustinian Developer Society.",
      introSupporting: "",
      about: "",
      mission: "",
      vision: "",
      socials: [],
      ...Object.fromEntries(
        Object.entries(data.settings || {}).filter(
          ([, value]) => value != null,
        ),
      ),
    },
    departments: departments.map((dept) => ({
      ...dept,
      purpose: "",
      responsibilities: [],
      ...Object.fromEntries(
        Object.entries(
          data.departments?.find(
            (item: { slug: string }) => item.slug === dept.slug,
          ) || {},
        ).filter(([, value]) => value != null),
      ),
      color: dept.color,
      name: dept.name,
    })),
    members: data.members || [],
    activities: (data.activities || []).filter(
      (item: { slug?: string }) => item.slug,
    ),
    faqs: data.faqs || [],
    featuredInitiatives: data.homepage?.initiatives || [],
    featuredEvents: data.homepage?.events || [],
  };
});
