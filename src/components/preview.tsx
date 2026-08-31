"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";
export function Preview() {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 5000);
    return () => clearInterval(timer);
  }, [router]);
  return (
    <>
      <div className="preview-bar">
        Draft preview — unpublished content
        <form action="/api/draft-mode/disable" method="post">
          <button type="submit">Exit preview ↗</button>
        </form>
      </div>
      <VisualEditing />
    </>
  );
}
