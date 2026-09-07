# Animations

Most animations use GSAP. The main rule is simple: content must still be visible and usable when animation is disabled.

## Before changing an animation

- Check `prefers-reduced-motion`.
- Animate transforms and opacity when possible.
- Clean up GSAP timelines and observers when a component closes.
- Pause repeating motion when it is offscreen.
- Test mouse, keyboard, and touch behavior.

## Partner animation

Code:

```text
src/components/values-marquee.tsx
src/app/globals.css
```

The layout shows six logo slots on desktop and three on mobile.

The logos do not all move upward. Their directions repeat like this:

- Exit: right, up, left, down.
- Enter: bottom, left, top, right.

Important timing values:

- Wait between cycles: 4.2 seconds.
- Delay between slots: 0.13 seconds.
- Exit duration: 0.48 seconds.
- Entry duration: 0.72 seconds.

The animation starts only when the section is visible. It pauses when the section leaves the screen. Reduced-motion users see static logos.

## Other animation files

| File | What it controls |
| --- | --- |
| `hero-motion.tsx` | Homepage hero entrance and pointer movement |
| `page-entrance.tsx` | General page and section entrances |
| `initiative-entrance.tsx` | Initiatives page entrance |
| `executive-entrance.tsx` | Team entrance |
| `initiative-showcase.tsx` | Draggable homepage initiative cards |
| `department-member-scroll.tsx` | Department member scrolling |
| `site-loader.tsx` | Loading screen |
| `ady-interactive.tsx` | Interactive character on the About page |

## Test after a change

1. Test desktop and mobile sizes.
2. Scroll the animation on and off the screen.
3. Turn on reduced motion in the browser or operating system.
4. Navigate away and return to the page.
5. Try rapid clicks, dragging, and scrolling.
6. Confirm that no text or controls stay hidden.

