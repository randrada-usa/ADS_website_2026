# Augustinian Developer Society Website

Official website of the Augustinian Developer Society of the University of San Agustin.

## Start the website

You need Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

The site can run without Sanity credentials. In that case, it shows demo content.

## Check your work

Run these before pushing a change:

```sh
npm run lint
npm run typecheck
npm run build
```

To run the demo smoke test, start the production website with `npm start`, then run this in another terminal:

```sh
npm run test:smoke
```

## Where things are

```text
src/app/(site)/          Pages and routes
src/components/         Shared components and animations
src/app/globals.css     Colors, layout, and responsive styles
src/lib/                Content loading and shared data
src/sanity/             Sanity Studio and schemas
public/                 Images and files used by the website
docs/                   Maintainer guides
```

## Common tasks

- Partner logos: read [docs/ASSET_GUIDE.md](docs/ASSET_GUIDE.md).
- Animations: read [docs/ANIMATIONS.md](docs/ANIMATIONS.md).
- Colors and layout: read [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- Before merging or releasing: use [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md).
- Recent major work: read [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Work still unfinished: read [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).

Content editing and deployment guides will be added after those workflows are final.

## Optional Sanity setup

The editing Studio is at `/studio`. Copy `.env.example` to `.env.local` and add:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
```

Never commit `.env.local` or share the read token. Sanity's public dataset should contain only information approved for publication.

## Important rules

- Do not commit secrets or private member information.
- Do not treat demo text or photos as official content.
- Keep essential content usable when animations are disabled.
- Test desktop and mobile layouts.
- Preserve unrelated work already in your Git working tree.
