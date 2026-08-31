import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { ActivityDetail } from "@/components/activity-detail";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const item = content.activities.find(
    (item) => item.slug === slug && item.kind === "initiative",
  );
  return {
    title: item?.title || "Activity not found",
    description: item?.summary,
  };
}
export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const item = content.activities.find(
    (item) => item.slug === slug && item.kind === "initiative",
  );
  if (!item) notFound();
  return <ActivityDetail activity={item} content={content} />;
}
