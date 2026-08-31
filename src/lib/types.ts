export type DepartmentSlug =
  "communications" | "technology" | "finance" | "legal" | "operations";
export type Department = {
  slug: DepartmentSlug;
  name: string;
  color: string;
  purpose: string;
  responsibilities: string[];
};
export type Member = {
  _id: string;
  name: string;
  position: string;
  department?: DepartmentSlug;
  portrait?: string;
  isHead?: boolean;
  isLeadership?: boolean;
  order?: number;
};
export type Activity = {
  _id: string;
  kind: "initiative" | "event";
  slug: string;
  title: string;
  summary: string;
  category: string;
  image?: string;
  imageAlt?: string;
  date?: string;
  endDate?: string;
  location?: string;
  role?: string;
  outcome?: string;
  body?: import("@portabletext/types").PortableTextBlock[];
  photos?: { url: string; alt: string; caption?: string }[];
  related?: string[];
  demo?: boolean;
};
export type FAQ = { _id: string; question: string; answer: string };
export type SiteSettings = {
  heroDescription: string;
  intro: string;
  introSupporting: string;
  about: string;
  mission: string;
  vision: string;
  email?: string;
  socials: { label: string; url: string }[];
};
export type SiteContent = {
  demo: boolean;
  settings: SiteSettings;
  departments: Department[];
  members: Member[];
  activities: Activity[];
  faqs: FAQ[];
  featuredInitiatives: string[];
  featuredEvents: string[];
};
