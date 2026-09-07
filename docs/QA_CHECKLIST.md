# QA Checklist

Use this before pushing a large change and before launch.

## Code checks

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] No secrets, temporary files, or unrelated changes in Git.

## Pages

- [ ] Home, About, Initiatives, Events, and Team open correctly.
- [ ] All five department pages open correctly.
- [ ] Initiative and event detail pages work.
- [ ] Header, footer, and back buttons go to the correct place.
- [ ] Invalid pages show the correct not-found page.

## Screen sizes

Check about 1440, 1024, 768, 390, and 320 px wide.

- [ ] There is no horizontal page scrolling.
- [ ] Navigation works on desktop and mobile.
- [ ] Text does not overlap circles or separators.
- [ ] Cards and controls are not cut off.
- [ ] Six partner logos appear on desktop and three on mobile.
- [ ] Every partner logo is fully visible.

## Interaction and animation

- [ ] Page entrances do not leave content hidden.
- [ ] Partner logos move in different directions at a comfortable speed.
- [ ] The partner animation pauses when offscreen.
- [ ] Initiative cards work with mouse and touch.
- [ ] FAQ items open and close correctly.
- [ ] Reduced-motion mode shows all content without required animation.
- [ ] Fast clicking, dragging, and scrolling do not break the page.

## Content and images

- [ ] No unwanted demo text, placeholder names, or temporary photos remain.
- [ ] Names, dates, roles, links, and claims are correct.
- [ ] Images are approved and have useful alternative text.
- [ ] Images are not blurry, stretched, cropped, or unexpectedly boxed.
- [ ] Partner logos use the newest approved files.

## Accessibility

- [ ] The site can be used with only a keyboard.
- [ ] Focus is always visible.
- [ ] The skip link works.
- [ ] Heading order makes sense.
- [ ] Controls have clear names.
- [ ] The page works at 200% zoom.

## Browsers

- [ ] Current Chrome or Edge.
- [ ] Current Firefox.
- [ ] Safari and iPhone if available.
- [ ] Android Chrome if available.
- [ ] No unexpected errors appear in the browser console.

## Before launch

- [ ] Test real Sanity publishing and preview access.
- [ ] Check the final production URL.
- [ ] Verify social links and the official email address.
- [ ] Review the known limitations.
- [ ] Confirm who owns the hosting and CMS accounts.

