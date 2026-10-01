import type { Metadata } from "next";
import Link from "next/link";
import { Studio } from "@/components/studio";
import { Eyebrow } from "@/components/ui";
import { cmsConfigured } from "@/lib/content";
export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  if (!cmsConfigured)
    return (
      <main className="studio-setup">
        <Eyebrow>ADS · Content Studio</Eyebrow>
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
            Add the project ID and dataset to a local <code>.env.local</code>
            {" "}file using <code>.env.example</code> as a template.
          </li>
          <li>
            Set the server-only Viewer token for draft previews, and add your
            site URL as a credentialed CORS origin in Sanity.
          </li>
          <li>
            Invite the officers who will maintain the website, then restart or
            redeploy. Keep the public site on demo content until it is ready.
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
