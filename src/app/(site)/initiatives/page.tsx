import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageIntro } from "@/components/ui";
import { ActivityBrowser } from "@/components/activity-browser";
export const metadata: Metadata = { title: "Initiatives" };
export default async function InitiativesPage() {
  const content = await getContent();
  return (
    <>
      <PageIntro
        label="What we do, together"
        title={
          <>
            Ideas with intention.
            <br />
            <span className="gradient-text">Action with purpose.</span>
          </>
        }
        description="Outreach, shared experiences, and connections beyond campus. This is what putting our curiosity to work looks like."
      />
      <section className="container listing-section">
        <ActivityBrowser
          activities={content.activities.filter(
            (item) => item.kind === "initiative",
          )}
          kind="initiative"
          now={0}
        />
      </section>
    </>
  );
}
