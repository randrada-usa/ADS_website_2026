import type { Activity } from "./types";
export const activityHref = (item: Activity) =>
  `/${item.kind === "event" ? "events" : "initiatives"}/${item.slug}`;
export function isUpcoming(item: Activity, now: number) {
  return Boolean(
    item.date && new Date(item.endDate || item.date).getTime() >= now,
  );
}
export function formatDate(date?: string) {
  return date
    ? new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      }).format(new Date(date))
    : "Date to be announced";
}
export function safeUrl(url?: string) {
  if (!url) return undefined;
  try {
    const value = new URL(url);
    return ["https:", "http:"].includes(value.protocol)
      ? value.href
      : undefined;
  } catch {
    return undefined;
  }
}
export function safeEmail(email?: string) {
  return email && /^[^\s@?&#%]+@[^\s@?&#%]+\.[^\s@?&#%]+$/.test(email)
    ? email
    : undefined;
}
