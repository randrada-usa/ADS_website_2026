"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container error-page">
      <h1>A small interruption.</h1>
      <p>We couldn’t load this content. Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again ↗
      </button>
    </section>
  );
}
