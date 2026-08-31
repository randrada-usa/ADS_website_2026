import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const ready = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET,
  );
  return {
    rules: {
      userAgent: "*",
      ...(ready
        ? { allow: "/", disallow: ["/studio", "/api/"] }
        : { disallow: "/" }),
    },
  };
}
