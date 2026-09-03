import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/dm-sans";
import "./globals.css";
const siteName = "Agustinian Developer Society - USA";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Meet the Augustinian Developer Society at the University of San Agustin. Explore our community, initiatives, events, and the people who make them happen.",
  icons: { icon: "/brand/ads.svg" },
  robots:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
      ? undefined
      : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_PH",
    title: siteName,
    description:
      "Curious minds. Shared purpose. A student community at the University of San Agustin.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
