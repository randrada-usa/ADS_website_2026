# Partner Logos

The homepage partner section is built in:

```text
src/components/values-marquee.tsx
```

The logos used by the website are in:

```text
public/assets/partners/current-*
```

Putting a file in the folder is not enough. You must also add it to the `partners` list in `values-marquee.tsx`.

## Prepare a logo

Use the same **480 × 192 px frame** for every logo.

- Center the logo.
- Keep its original proportions.
- Leave transparent space around it.
- Make sure the full name and mark fit inside the frame.
- Do not stretch a narrow logo to fill the width.
- Use SVG for clean vector artwork.
- Use PNG when SVG does not render correctly.
- Avoid JPEG because it does not support transparency well.

Different logo widths are okay. The website uses `object-fit: contain` so the full logo fits inside its slot.

## Name the file

Use lowercase words separated by hyphens:

```text
current-partner-name.svg
current-partner-name.png
```

If the browser keeps showing an old cached image, use a versioned name such as:

```text
current-partner-name-v2.png
```

Then update the filename in `values-marquee.tsx`.

## Add or replace a logo

1. Export the logo on a 480 × 192 px frame.
2. Put it in `public/assets/partners/`.
3. Add or update its entry in the `partners` list.
4. Use `width: 480` and `height: 192`.
5. Check the logo on desktop and mobile.
6. Watch at least one full animation cycle.
7. Run the project checks from the README.

## Before you finish

- The entire logo is visible.
- The logo is centered and not stretched.
- Small text is readable.
- There is no unwanted white box behind it.
- The newest file appears, not an older version.
- The partner name in the code is correct.

The local folder `assets/Partners/` is ignored by Git. Files needed by the website must be copied into `public/assets/partners/`.

