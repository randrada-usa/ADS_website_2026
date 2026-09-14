"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Eyebrow } from "./ui";

const partners = [
  { name: "A", logo: "/assets/partners/current-a.png", width: 480, height: 192 },
  { name: "Akubo", logo: "/assets/partners/current-akubo.png", width: 480, height: 192 },
  { name: "CDG", logo: "/assets/partners/current-cdg.svg", width: 480, height: 192 },
  { name: "DEVCON Iloilo", logo: "/assets/partners/current-devcon-iloilo.png", width: 480, height: 192 },
  { name: "ESET", logo: "/assets/partners/current-eset.png", width: 480, height: 192 },
  { name: "Gather", logo: "/assets/partners/current-gather.svg", width: 480, height: 192 },
  { name: "Htech", logo: "/assets/partners/current-htech.png", width: 480, height: 192 },
  { name: "ICS", logo: "/assets/partners/current-ics-v2.png", width: 480, height: 192 },
  { name: "GDSC National University Manila", logo: "/assets/partners/current-gdsc-national-university-manila.png", width: 480, height: 192 },
  { name: "GDSC PUP Sto. Tomas Branch", logo: "/assets/partners/current-gdsc-pup-sto-tomas-branch.png", width: 480, height: 192 },
  { name: "GDSC University of Negros Occidental-Recoletos", logo: "/assets/partners/current-gdsc-university-of-negros-occidental-recolectos.png", width: 480, height: 192 },
  { name: "GDSC UP Manila", logo: "/assets/partners/current-gdsc-up-manila.png", width: 480, height: 192 },
  { name: "ICpEP", logo: "/assets/partners/current-icpep.png", width: 480, height: 192 },
  { name: "ITB", logo: "/assets/partners/current-itb.svg", width: 480, height: 192 },
  { name: "LZ Cybersecurity", logo: "/assets/partners/current-lz-cybersecurity.png", width: 480, height: 192 },
  { name: "NVIDIA AI Academy Philippines", logo: "/assets/partners/current-nvidia-ai-academy-ph.png", width: 480, height: 192 },
  { name: "PH Startup Online", logo: "/assets/partners/current-ph-start-up-online-v2.svg", width: 480, height: 192 },
  { name: "Taiger Pilipinas", logo: "/assets/partners/current-taiger-pilipinas-v2.png", width: 480, height: 192 },
  { name: "Tech for All", logo: "/assets/partners/current-tech-for-all.png", width: 480, height: 192 },
  { name: "Tech 4 Tomorrow", logo: "/assets/partners/current-tech4tomorrow.png", width: 480, height: 192 },
  { name: "University of San Agustin", logo: "/assets/partners/current-ua.png", width: 480, height: 192 },
  { name: "UAPSA USA", logo: "/assets/partners/current-uapsa-usa.png", width: 480, height: 192 },
  { name: "USA ACES", logo: "/assets/partners/current-usa-aces.png", width: 480, height: 192 },
  { name: "USA Publications", logo: "/assets/partners/current-usa-pub.png", width: 480, height: 192 },
  { name: "Zuitt", logo: "/assets/partners/current-zuitt.svg", width: 480, height: 192 },
];

const partnerSlots = Array.from({ length: 6 }, (_, slot) =>
  partners.filter((_, index) => index % 6 === slot),
);

const exitDirections = [
  { xPercent: 145, yPercent: 0 },
  { xPercent: 0, yPercent: -165 },
  { xPercent: -145, yPercent: 0 },
  { xPercent: 0, yPercent: 165 },
];

const enterDirections = [
  { xPercent: 0, yPercent: 165 },
  { xPercent: -145, yPercent: 0 },
  { xPercent: 0, yPercent: -165 },
  { xPercent: 145, yPercent: 0 },
];

export function ValuesMarquee() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const slots = Array.from(
        root.querySelectorAll<HTMLElement>(".partner-logo-slot"),
      );
      let round = 0;
      let delayedCycle: gsap.core.Tween | undefined;
      let transition: gsap.core.Timeline | undefined;
      let hasEntered = false;
      let inView = false;

      const logoAt = (slot: HTMLElement, index: number) => {
        const logos = Array.from(
          slot.querySelectorAll<HTMLElement>(".partner-logo"),
        );
        return logos[index % logos.length];
      };

      function schedule(delay = 4.2) {
        delayedCycle?.kill();
        if (inView) delayedCycle = gsap.delayedCall(delay, cycle);
      }

      function cycle() {
        transition?.kill();
        transition = gsap.timeline({
          onComplete: () => {
            round += 1;
            slots.forEach((slot) => {
              const logos = slot.querySelectorAll(".partner-logo");
              const partner =
                partnerSlots[Number(slot.dataset.slot)][round % logos.length];
              slot.setAttribute("aria-label", partner.name);
            });
            schedule();
          },
        });

        slots.forEach((slot, slotIndex) => {
          const current = logoAt(slot, round);
          const next = logoAt(slot, round + 1);
          const at = slotIndex * 0.13;
          const exit = exitDirections[slotIndex % exitDirections.length];
          const enter = enterDirections[slotIndex % enterDirections.length];

          gsap.set(next, { ...enter, autoAlpha: 0 });
          transition!
            .to(
              current,
              {
                ...exit,
                duration: 0.48,
                ease: "power2.in",
              },
              at,
            )
            .set(current, { autoAlpha: 0 }, at + 0.48)
            .to(
              next,
              {
                xPercent: 0,
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.72,
                ease: "power3.out",
              },
              at + 0.38,
            )
            .set(current, { xPercent: 0, yPercent: 0 }, at + 1.1);
        });
      }

      const context = gsap.context(() => {
        slots.forEach((slot) => {
          const logos = slot.querySelectorAll(".partner-logo");
          gsap.set(logos, { xPercent: 0, yPercent: 0, autoAlpha: 0 });
          gsap.set(logos[0], { autoAlpha: 1 });
        });
      }, root);

      const observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) {
            if (transition && transition.progress() < 1) {
              transition.resume();
            } else {
              schedule(hasEntered ? 0.8 : 1.9);
            }
            hasEntered = true;
          } else {
            delayedCycle?.kill();
            transition?.pause();
          }
        },
        { threshold: 0.18 },
      );
      observer.observe(root);

      return () => {
        observer.disconnect();
        delayedCycle?.kill();
        transition?.kill();
        context.revert();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="values-strip partner-strip"
      aria-label="Previous partners"
    >
      <div className="partner-strip-label section-boundary-label">
        <Eyebrow>Previous Partners</Eyebrow>
      </div>
      <div className="partner-wall">
        {partnerSlots.map((slot, slotIndex) => (
          <span
            className="partner-logo-slot"
            data-slot={slotIndex}
            role="img"
            aria-label={slot[0].name}
            key={slotIndex}
          >
            {slot.map((partner, partnerIndex) => (
              <span
                className="partner-logo"
                aria-hidden="true"
                key={partner.name}
                style={{
                  visibility: partnerIndex === 0 ? "visible" : "hidden",
                }}
              >
                <Image
                  src={partner.logo}
                  alt=""
                  width={partner.width}
                  height={partner.height}
                  sizes="(max-width: 650px) 28vw, 14vw"
                />
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
