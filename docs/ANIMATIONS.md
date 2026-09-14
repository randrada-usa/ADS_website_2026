# Animation Guide

Motion supports hierarchy and personality without controlling access to content. All essential text and controls must remain usable when animation is unavailable.

## General rules

- Honor `prefers-reduced-motion` for every nonessential animation.
- Scope GSAP work to the component root and clean up observers, timelines, delayed calls, and contexts when the component unmounts.
- Pause continuous or scheduled motion while its section is outside the viewport.
- Do not leave content invisible while JavaScript loads.
- Avoid animating layout properties when transforms and opacity can provide the same effect.
- Test keyboard interaction and touch behavior separately from hover motion.

## Previous Partners rotation

Implemented in `src/components/values-marquee.tsx`, with layout rules in `src/app/globals.css`.

### Layout

- Desktop: six fixed logo slots.
- Mobile at 650 px and below: three visible slots; slots four through six are hidden.
- Each slot clips its own transition so one logo cannot overlap another slot.
- Images use `object-fit: contain` within a centered frame.

### Sequence

Each slot owns a subset of the partner list. At every cycle, the visible logo exits and the next logo enters. Directions repeat across slots rather than moving every logo upward:

| Phase | Direction pattern               |
| ----- | ------------------------------- |
| Exit  | right, up, left, down           |
| Entry | bottom, left, top, right        |

Current timing:

- Initial wait after first entering the viewport: **1.9 s**.
- Normal hold between completed cycles: **4.2 s**.
- Resume wait after returning to an already-seen section: **0.8 s**.
- Slot stagger: **0.13 s**.
- Exit: **0.48 s**, `power2.in`.
- Entry: **0.72 s**, `power3.out`.
- Entry begins **0.38 s** after that slot's exit starts, creating a brief overlap.
- Intersection threshold: **0.18**.

When the section leaves the viewport, its scheduled cycle is cancelled and an active transition pauses. It resumes when the section becomes visible again. With reduced motion enabled, the first partner in each visible slot remains static.

## Other motion owners

- `site-loader.tsx`: initial brand-loader state; CSS supplies the draw and breathing motion.
- `hero-motion.tsx`: hero entrance, decorative drift, pointer parallax, and icon response.
- `page-entrance.tsx`: shared in-view entrances and separator/emblem handling.
- `initiative-entrance.tsx`: initiatives-page entrance sequence.
- `executive-entrance.tsx`: executive/team entrance sequence.
- `initiative-showcase.tsx`: draggable featured-initiative stack and hint behavior.
- `department-member-scroll.tsx`: desktop horizontal member presentation driven by scroll.
- `motion.tsx`: shared decorative floating and in-view behavior.
- `ady-interactive.tsx`: About-page character interaction.

## Changing motion safely

1. Change one timing or distance group at a time.
2. Compare desktop, tablet, and phone behavior.
3. Scroll the animation partly offscreen and back to verify pause/resume behavior.
4. Enable reduced motion at the operating-system or browser level.
5. Navigate away and back to catch stale observers or duplicate timelines.
6. Check rapid pointer movement, repeated clicks, and touch gestures.
7. Run the full QA checklist before merging.

