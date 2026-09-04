"use client";

import { useEffect } from "react";

export function DepartmentScrollTop() {
  useEffect(() => {
    if (window.location.hash !== "#top") return;
    // Reset after the previous department's pinned scroll section is cleaned up.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
