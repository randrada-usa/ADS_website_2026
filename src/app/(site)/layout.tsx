import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/ui";
import { AmbientMotion } from "@/components/motion";
import { Preview } from "@/components/preview";
import { getContent, isPreview } from "@/lib/content";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  return (
    <div className="website">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="color-stripe" />
      {preview && <Preview />}
      <Navigation socials={content.settings.socials} />
      <main id="main">{children}</main>
      <Footer
        settings={content.settings}
        activities={content.activities}
      />
      <AmbientMotion />
    </div>
  );
}
