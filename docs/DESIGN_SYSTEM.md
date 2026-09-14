# Design System

Most shared styles are in:

```text
src/app/globals.css
```

Use the existing variables and classes before adding a new one-off style.

## Colors

| Variable  | Color     | Main use                    |
| ---       | ---       | ---                         |
| `--ink`   | `#28313b` | Text, borders, shadows      |
| `--muted` | `#626c74` | Secondary text              |
| `--paper` | `#fcfcf9` | Main background             |
| `--blue`  | `#3c6597` | Brand accent and focus      |
| `--teal`  | `#61ad9e` | Brand accent                |
| `--yellow`| `#f2ba5e` | Brand accent                |
| `--orange`| `#e2815a` | Brand accent                |
| `--red`   | `#df5b5b` | Brand accent                |
| `--line`  | `#dadfdc` | Light dividers              |

## Fonts

- Body text: DM Sans Variable.
- Headings: Space Grotesk Variable.
- Both fonts are installed in the project. Do not load them from Google Fonts.

## Backgrounds

The main paper grid repeats every 24 px.

Homepage sections use these fixed backgrounds:

- About: pale yellow.
- Initiatives and FAQ: pale blue.
- Team: warm gray.
- Events, departments, journey, and partners: paper grid.

Target a section by its ID or class when setting a background. Do not depend only on `nth-of-type`. Adding or removing a section would shift the colors.

## Layout

- Main maximum content width: 1320 px.
- Desktop side gutter: 96 px.
- Normal section spacing: 96–128 px.
- Navigation height: 77 px.

Reuse `.container` and `.section` when possible.

## Responsive sizes

Use these common breakpoints:

- Desktop layout: above 1100 px.
- Tablet and mobile navigation: 850 px and below.
- Mobile component layout: 650 px and below.
- Small-phone fixes: about 420–550 px.

Only add a new breakpoint when the content clearly needs it.

## Visual rules

- Main borders are usually 2 px and use `--ink`.
- Cards and labels use small offset shadows, not soft shadows.
- Decorative circles must stay behind text, buttons, and section labels.
- Hover effects must not be required on touch devices.
- Keyboard focus must remain visible.
- Do not use color or animation as the only way to communicate meaning.

