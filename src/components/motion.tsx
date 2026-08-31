"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
export function AmbientMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to("[data-float]", {
        y: -9,
        rotation: "+=2",
        duration: 3.4,
        ease: "sine.inOut",
        stagger: 0.5,
        repeat: -1,
        yoyo: true,
      });
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
