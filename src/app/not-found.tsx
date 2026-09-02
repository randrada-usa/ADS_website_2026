import Link from "next/link";
import { BackButton, Eyebrow } from "@/components/ui";
export default function NotFound() {
  return (
    <main className="error-page container">
      <div className="page-intro-back">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>
      <Eyebrow>404 · A little off the map</Eyebrow>
      <h1>Let’s find your way back.</h1>
      <p>This page doesn’t exist, or it may have moved.</p>
      <Link className="button" href="/">
        Back to ADS ↗
      </Link>
    </main>
  );
}

