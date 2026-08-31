import type { Metadata } from "next";
import Link from "next/link";
import { Studio } from "@/components/studio";
import { cmsConfigured } from "@/lib/content";
export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  if (!cmsConfigured)
    return (
      <main className="studio-setup">
        <span className="eyebrow">ADS · Content Studio</span>
        <h1>Your editing space is ready to connect.</h1>
        <p>
          The website is currently showing labeled demo content. To enable real
          content and authorized CMS logins, connect your organization’s Sanity
          project.
        </p>
        <ol>
          <li>
            Create a Sanity Free project and a public <code>production</code>{" "}
            dataset.
          </li>
          <li>
            Add the project ID and dataset to the environment variables in{" "}
            <code>.env.example</code>.
          </li>
          <li>
            Set the server-only Viewer token for draft previews, and add your
            site URL as a credentialed CORS origin in Sanity.
          </li>
          <li>
            Invite the officers who will maintain the website, then restart or
            redeploy.
          </li>
        </ol>
        <p>
          Setup instructions are in the project README. This screen does not
          grant editing access; Sanity authentication is required once
          connected.
        </p>
        <Link className="button" href="/">
          Back to the website ↗
        </Link>
      </main>
    );
  return <Studio />;
}
