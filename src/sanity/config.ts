"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineLocations, presentationTool } from "sanity/presentation";
import { schemaTypes, departmentTemplates } from "./schema";
import { departments } from "@/lib/demo";
const singletons = new Set(["homepage", "siteSettings", "department"]);
export const studioConfig = defineConfig({
  name: "ads",
  title: "ADS · Content Studio",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("ADS content")
          .items([
            S.listItem()
              .title("Homepage")
              .child(
                S.document().schemaType("homepage").documentId("homepage"),
              ),
            S.listItem()
              .title("Organization & contact")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.divider(),
            S.listItem()
              .title("Departments")
              .child(
                S.list()
                  .title("Departments")
                  .items(
                    departments.map((dept) =>
                      S.listItem()
                        .title(dept.name)
                        .child(
                          S.document()
                            .schemaType("department")
                            .documentId(`department-${dept.slug}`)
                            .initialValueTemplate(`department-${dept.slug}`),
                        ),
                    ),
                  ),
              ),
            S.documentTypeListItem("member").title("Members & leadership"),
            S.documentTypeListItem("activity").title("Initiatives & events"),
            S.documentTypeListItem("faq").title("Frequently asked questions"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        locations: {
          homepage: { locations: [{ title: "Homepage", href: "/" }] },
          siteSettings: {
            locations: [
              { title: "Homepage", href: "/" },
              { title: "About", href: "/about" },
            ],
          },
          faq: { locations: [{ title: "FAQ", href: "/#faq" }] },
          member: { locations: [{ title: "Team", href: "/team" }] },
          department: defineLocations({
            select: { name: "name", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: doc.name || "Department",
                      href: `/departments/${doc.slug}`,
                    },
                  ]
                : [],
            }),
          }),
          activity: defineLocations({
            select: { title: "title", slug: "slug.current", kind: "kind" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: doc.title || "Activity",
                      href: `/${doc.kind === "event" ? "events" : "initiatives"}/${doc.slug}`,
                    },
                  ]
                : [],
            }),
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter((template) => !singletons.has(template.schemaType)),
      ...departmentTemplates,
    ],
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter(
        (option) =>
          !singletons.has(option.templateId) &&
          !option.templateId.startsWith("department-"),
      ),
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(
            (action) =>
              action.action !== "duplicate" && action.action !== "delete",
          )
        : actions,
  },
});
