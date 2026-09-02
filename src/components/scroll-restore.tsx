"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollRestoreManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      const saved = sessionStorage.getItem("ads_last_scroll_home");
      if (saved) {
        const targetY = parseInt(saved, 10);
        if (!isNaN(targetY) && targetY > 0) {
          // Attempt immediate restore
          window.scrollTo({ top: targetY, behavior: "instant" });

          // Also schedule animation frames and a brief timeout to guarantee restoration after layout paints
          requestAnimationFrame(() => {
            window.scrollTo({ top: targetY, behavior: "instant" });
          });

          const timer = setTimeout(() => {
            window.scrollTo({ top: targetY, behavior: "instant" });
          }, 60);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [pathname]);

  return null;
}
