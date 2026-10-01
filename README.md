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

Deployment instructions will be added after the hosting workflow is final.

## Set up Sanity before the content is finished

The content model and editing Studio are already built into this repository. You
can start writing drafts without switching the public website away from its
current demo content.

1. Create or select an organization-owned Sanity project at
   [sanity.io/manage](https://www.sanity.io/manage). Use a public `production`
   dataset for content that has been approved for publication. Do not publish
   unfinished copy, private member details, or unapproved photos.
2. Add `http://localhost:3000` under the project's **API > CORS Origins** and
   enable **Allow credentials** for the embedded Studio. Add the eventual
   deployed origin separately when hosting is decided.
3. Copy `.env.example` to a Git-ignored `.env.local` at the repository root:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=<your project ID>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_SITE_CONTENT_ENABLED=false
SANITY_API_READ_TOKEN=
```

4. Restart `npm run dev` and visit `http://localhost:3000/studio`. Sign in with
   an authorized Sanity account. Editors can create documents and save drafts
   without publishing them. The website continues to show demo content, with
   `noindex` metadata and a disallowing `robots.txt`.
5. Optional: create a **Viewer/read-only** API token in the project's API
   settings and put it in `SANITY_API_READ_TOKEN` *only on the server*. This is
   required for Presentation draft previews, including unpublished documents.
   Never prefix it with `NEXT_PUBLIC_`, commit it, or share it in chat.

When the content is complete and approved, finish the
[launch checklist](docs/QA_CHECKLIST.md), confirm hosting and access, and set
`SANITY_SITE_CONTENT_ENABLED=true` in the deployment environment. Rebuild or
redeploy after changing environment variables. Only then does the public site
read published Sanity content and allow search indexing. A connected but empty
dataset will otherwise produce mostly empty pages, so do not enable this flag
early. Copy the approved stories from `content.md` into activity documents in
Studio; the Markdown file is not automatically imported.

Never commit `.env.local` or share a read token. Sanity's public dataset should
contain only information approved for publication. Drafts are visible to
authorized editors through Studio and token-protected previews.

## Important rules

- Do not commit secrets or private member information.
- Do not treat demo text or photos as official content.
- Keep essential content usable when animations are disabled.
- Test desktop and mobile layouts.
- Preserve unrelated work already in your Git working tree.
