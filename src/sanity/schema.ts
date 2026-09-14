import { defineArrayMember, defineField, defineType } from "sanity";
import { departments } from "@/lib/demo";
const imageFields = [
  defineField({
    name: "alt",
    title: "Image description (accessibility)",
    type: "string",
    validation: (rule) => rule.required(),
  }),
];
const story = defineField({
  name: "body",
  title: "The story",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "External link",
            type: "object",
            fields: [
              {
                name: "href",
                type: "url",
                validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
export const schemaTypes = [
  defineType({
    name: "siteSettings",
    title: "Organization & contact",
    type: "document",
    fields: [
      defineField({
        name: "heroDescription",
        title: "Homepage introduction",
        type: "text",
        rows: 3,
        validation: (r) => r.required().max(250),
      }),
      defineField({
        name: "intro",
        title: "Who we are — short introduction",
        type: "text",
        rows: 3,
      }),
      defineField({
        name: "introSupporting",
        title: "Who we are — supporting paragraph",
        type: "text",
        rows: 3,
      }),
      defineField({ name: "about", title: "Our story", type: "text", rows: 7 }),
      defineField({
        name: "mission",
        title: "Approved mission",
        type: "text",
        rows: 3,
      }),
      defineField({
        name: "vision",
        title: "Approved vision",
        type: "text",
        rows: 3,
      }),
      defineField({
        name: "email",
        title: "Verified public contact email",
        description:
          "Use an organization address, never a private member email.",
        type: "string",
        validation: (r) => r.email(),
      }),
      defineField({
        name: "socials",
        title: "Verified social links",
        description:
          "Use Facebook, LinkedIn, Instagram, or TikTok as the platform name to enable its navigation icon. Other platforms appear in the footer.",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [
              defineField({
                name: "label",
                title: "Platform name",
                type: "string",
                validation: (r) => r.required(),
              }),
              defineField({
                name: "url",
                title: "Official profile URL",
                type: "url",
                validation: (r) => r.required().uri({ scheme: ["https"] }),
              }),
            ],
          }),
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Organization & contact" }) },
  }),
  defineType({
    name: "homepage",
    title: "Homepage",
    type: "document",
    fields: [
      defineField({
        name: "featuredInitiatives",
        title: "Featured initiatives",
        description:
          "Drag to reorder. Up to three published initiatives appear on the homepage.",
        type: "array",
        validation: (r) => r.max(3).unique(),
        of: [
          defineArrayMember({
            type: "reference",
            to: [{ type: "activity" }],
            options: { filter: 'kind == "initiative"' },
          }),
        ],
      }),
      defineField({
        name: "featuredEvents",
        title: "Featured events",
        description:
          "Drag to reorder. The first item also becomes the Events page feature. Up to two on the homepage.",
        type: "array",
        validation: (r) => r.max(2).unique(),
        of: [
          defineArrayMember({
            type: "reference",
            to: [{ type: "activity" }],
            options: { filter: 'kind == "event"' },
          }),
        ],
      }),
    ],
    preview: { prepare: () => ({ title: "Homepage featured content" }) },
  }),
  defineType({
    name: "department",
    title: "Department",
    type: "document",
    fields: [
      defineField({
        name: "name",
        title: "Department",
        type: "string",
        readOnly: true,
        validation: (r) => r.required(),
      }),
      defineField({
        name: "slug",
        title: "Page address",
        type: "slug",
        readOnly: true,
        validation: (r) => r.required(),
      }),
      defineField({
        name: "purpose",
        title: "Purpose",
        type: "text",
        rows: 3,
        validation: (r) => r.required().max(350),
      }),
      defineField({
        name: "responsibilities",
        title: "Responsibilities",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        validation: (r) => r.max(6),
      }),
    ],
    preview: { select: { title: "name" } },
  }),
  defineType({
    name: "member",
    title: "Member",
    type: "document",
    fields: [
      defineField({
        name: "name",
        title: "Public display name",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "position",
        title: "Position",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "portrait",
        title: "Approved portrait",
        description:
          "Only upload photos approved for public display. Uploaded files are public.",
        type: "image",
        options: { hotspot: true },
      }),
      defineField({
        name: "department",
        title: "Department",
        type: "reference",
        to: [{ type: "department" }],
      }),
      defineField({
        name: "isHead",
        title: "Department head",
        type: "boolean",
        initialValue: false,
        validation: (r) =>
          r.custom((value, context) =>
            value && !context.document?.department
              ? "Select a department for its head."
              : true,
          ),
      }),
      defineField({
        name: "isLeadership",
        title: "Show on the Team page",
        description:
          "Enable for current executive board members and department heads.",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "order",
        title: "Display order",
        description: "Lower numbers appear first.",
        type: "number",
        initialValue: 10,
        validation: (r) => r.integer().min(0),
      }),
    ],
    preview: {
      select: { title: "name", subtitle: "position", media: "portrait" },
    },
  }),
  defineType({
    name: "activity",
    title: "Initiative / event",
    type: "document",
    fields: [
      defineField({
        name: "kind",
        title: "Content type",
        type: "string",
        initialValue: "initiative",
        options: {
          list: [
            { title: "Initiative — purpose and impact", value: "initiative" },
            { title: "Event — a dated activity or recap", value: "event" },
          ],
          layout: "radio",
        },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (r) => r.required().max(100),
      }),
      defineField({
        name: "slug",
        title: "Page address",
        type: "slug",
        options: { source: "title", maxLength: 90 },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "summary",
        title: "Short introduction",
        type: "text",
        rows: 3,
        validation: (r) => r.required().max(300),
      }),
      defineField({
        name: "category",
        title: "Category",
        type: "string",
        options: {
          list: [
            "Community outreach",
            "External participation",
            "Workshop",
            "Tech talk",
            "Hackathon",
            "Networking",
            "Community activity",
          ],
        },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "image",
        title: "Cover photo",
        type: "image",
        options: { hotspot: true },
        fields: imageFields,
      }),
      defineField({
        name: "date",
        title: "Start date & time",
        description: "Displayed to visitors in Philippine time.",
        type: "datetime",
        validation: (r) =>
          r.custom((value, context) =>
            context.document?.kind === "event" && !value
              ? "Events need a date."
              : true,
          ),
      }),
      defineField({
        name: "endDate",
        title: "End date & time (optional)",
        type: "datetime",
        validation: (r) =>
          r.custom((value, context) =>
            value &&
            context.document?.date &&
            new Date(value) < new Date(String(context.document.date))
              ? "End date must be after the start date."
              : true,
          ),
      }),
      defineField({ name: "location", title: "Location", type: "string" }),
      defineField({
        name: "role",
        title: "ADS’s role",
        description:
          "For example: organizer, participant, or outreach partner.",
        type: "string",
      }),
      story,
      defineField({
        name: "outcome",
        title: "Outcomes and impact",
        type: "text",
        rows: 4,
      }),
      defineField({
        name: "photos",
        title: "Supporting photos",
        description: "Upload compressed web photos approved for publication.",
        type: "array",
        of: [
          defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
              ...imageFields,
              defineField({
                name: "caption",
                title: "Caption",
                type: "string",
              }),
            ],
          }),
        ],
      }),
      defineField({
        name: "related",
        title: "Related initiatives or events",
        description:
          "Link to another activity rather than duplicating its story.",
        type: "array",
        of: [
          defineArrayMember({ type: "reference", to: [{ type: "activity" }] }),
        ],
        validation: (r) => r.unique(),
      }),
    ],
    preview: { select: { title: "title", subtitle: "kind", media: "image" } },
  }),
  defineType({
    name: "faq",
    title: "FAQ",
    type: "document",
    fields: [
      defineField({
        name: "question",
        title: "Question",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "answer",
        title: "Approved answer",
        type: "text",
        rows: 5,
        validation: (r) => r.required(),
      }),
      defineField({
        name: "order",
        title: "Display order",
        type: "number",
        initialValue: 10,
      }),
    ],
    preview: { select: { title: "question" } },
  }),
];
export const departmentTemplates = departments.map((dept) => ({
  id: `department-${dept.slug}`,
  title: dept.name,
  schemaType: "department",
  value: { name: dept.name, slug: { _type: "slug", current: dept.slug } },
}));
