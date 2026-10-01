import type { MetadataRoute } from "next";
import { siteContentEnabled } from "@/lib/sanity-env";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(siteContentEnabled
        ? { allow: "/", disallow: ["/studio", "/api/"] }
        : { disallow: "/" }),
    },
  };
}
