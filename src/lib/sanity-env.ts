export const cmsConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET,
);

// Connecting Studio must not automatically publish an unfinished site.
export const siteContentEnabled =
  cmsConfigured && process.env.SANITY_SITE_CONTENT_ENABLED === "true";
