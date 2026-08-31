# Augustinian Developer Society

Official website implementation for the **Augustinian Developer Society**, **University of San Agustin**. Target launch: September 18, 2026.

## Run locally

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. No credentials are required to preview the design. Without Sanity configuration, the site uses explicitly labeled demo content, sample dates, silhouette portraits, and stock photography. Demo pages include noindex metadata and a disallow-all robots file.

```sh
npm run lint
npm run typecheck
npm run build
npm start
# In another terminal, with demo mode active:
npm run test:smoke
```

## Pages and design

- Home, About, Initiatives, Events, Team.
- Initiative and event detail pages with related stories and supporting photos.
- Communications, Technology, Finance, Legal, and Operations department pages.
- FAQ and contact in the homepage/footer; no recruitment, registration, Gallery, or academic-term archives.
- Member cards contain only portrait, name, and position.
- Supplied SVG branding, exact department colors, a light paper grid, outlined cards, and offset shadows.
- Self-hosted Space Grotesk and DM Sans variable fonts. No browser requests to Google Fonts.
- Responsive navigation, keyboard controls, skip link, descriptive image text, native FAQ disclosure controls, and reduced-motion support. GSAP animates decorative elements only; content is never hidden pending animation.

## Connect the CMS

The Studio is implemented at `/studio`. It uses **Sanity's authentication and project access controls**, not a custom password database. The setup page shown without credentials does not provide editing access.

1. Create a Sanity Free project under appropriate ADS ownership and a public dataset named `production`.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: project ID.
   - `NEXT_PUBLIC_SANITY_DATASET`: `production`.
   - `SANITY_API_READ_TOKEN`: a **Viewer** API token, used only on the server for authenticated preview. Never prefix this token with `NEXT_PUBLIC_`, commit it, or share it in chat.
3. Add `http://localhost:3000` and the final website origin under Sanity API → CORS origins, with **Allow credentials** enabled. Add only exact trusted preview origins that editors actually use.
4. Invite authorized officers using individual Sanity accounts. On the Free plan, writable access uses the broad Administrator role; grant it only to trusted maintainers. No public visitor accounts exist.
5. Restart the development server (or redeploy after setting the same variables in Vercel).
6. Visit `/studio`, sign in, and fill the content in the sequence below.

Sanity Free datasets and uploaded files are public. Store only publication-approved content. Do not upload private member information, sensitive photos, phone numbers, documents, or secrets. Hiding a field from a webpage does not make the underlying content private.

## Editorial workflow (no Git)

1. **Organization & contact:** approved introduction, supporting paragraph, story, mission, vision, official email and social links. Use Facebook, LinkedIn, Instagram, or TikTok as the platform name to activate its navbar icon; missing links display labeled placeholders.
2. **Departments:** open each of the five fixed entries, add purpose and responsibilities, and publish it before assigning members.
3. **Members & leadership:** add name, position, approved portrait, and department. Enable “Department head” as applicable; enable “Show on the Team page” for executive board members and department heads. Lower display-order numbers appear first. There are no academic-term archives.
4. **Initiatives & events:** select the content type, write the story, generate the slug, and add a cover photo with alt text. Events require a date. Supporting photos need image descriptions. Link related records instead of copying their content. Dates display in Philippine time.
5. **FAQ:** add approved answers and display order.
6. **Homepage:** select up to three featured initiatives and two events; drag to reorder. The first selected event is also the Events page feature. Leaving selections empty shows an honest empty state.
7. Open **Presentation** for draft preview. The integration validates Sanity's preview secret before enabling Next.js Draft Mode. The Viewer token remains server-only. Draft views refresh every five seconds while visible. The preview banner offers an exit action.
8. Click **Publish** when ready. Anonymous visitors only query the published perspective. Public data is cached for 60 seconds; the next visit after expiry triggers background revalidation, so changes may require another refresh. Draft previews bypass that cache.

With a project connected, empty CMS collections remain empty; the website does not silently repopulate them with demo records. A CMS outage shows an error rather than substituting fabricated activity data.

## Vercel handoff

- Import the repository with the Next.js framework preset. Standard `npm run build` and output settings work; use a supported Node 22+ runtime.
- Configure the three Sanity environment variables for the intended deployment environment. Set exact production/preview CORS origins in Sanity.
- Confirm the selected Vercel plan's eligibility, usage quotas, and repository-integration requirements. Zero-budget deployment is the target, not a promise of unlimited hosting or team features. No paid services have been activated.
- Use the provided `vercel.app` address unless ADS already owns a domain. Do not buy a domain or upgrade a plan without approval.
- No custom edge runtime is required. Public pages use Next.js rendering and cached content reads; preview handlers use the default Node runtime. Images use Next.js optimization and local/Sanity asset URLs.
- Before announcing launch: replace demo content, verify all claims and links, obtain photo approval, test CMS publishing and draft isolation using real authorized accounts, check mobile layouts, and confirm account recovery/handoff ownership.
- Live Sanity authentication, publishing, CORS, and Vercel deployment require real accounts and were not exercised by local demo checks.

## Contact and spam

Contact uses verified `mailto:` and external social links only. Missing links are not replaced with invented addresses. There is no email-sending API or contact form. Rate limiting the website cannot prevent direct mail to a published address; use an organization alias and the email provider's spam controls.

## Source map

- `src/app/(site)/`: public routes and layout.
- `src/components/`: shared UI, responsive navigation, filters, preview, and decorative motion.
- `src/lib/content.ts`: cached Sanity reads and demo/live boundary.
- `src/lib/demo.ts`: labeled sample content.
- `src/sanity/`: schemas, fixed department entries, editorial structure, and Presentation configuration.
- `public/brand/`: copies of the approved SVG assets; originals remain in `assets/`.
- `src/app/globals.css`: responsive design system.

Targeted npm overrides patch `js-yaml` and `smol-toml` under `@vercel/frameworks`, and `uuid` under `typeid-js` in Sanity's CLI dependency chain. Review and remove these when upstream packages adopt patched dependencies. Avoid `npm audit fix --force` downgrades without compatibility review.

## Temporary image credits

The following Unsplash CDN images are **design placeholders**, not photos of ADS members or events. Replace them with approved originals before launch:

- `public/images/teamwork.jpg`: https://images.unsplash.com/photo-1519389950473-47ba0277781c
- `public/images/community.jpg`: https://images.unsplash.com/photo-1523580494863-6f3031224c94
- `public/images/workshop.jpg`: https://images.unsplash.com/photo-1516321318423-f06f85e504b3

Font licenses are included with the `@fontsource-variable/space-grotesk` and `@fontsource-variable/dm-sans` packages. ADS retains its existing brand assets.
