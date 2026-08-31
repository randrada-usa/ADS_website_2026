"use client";
import { NextStudio } from "next-sanity/studio";
import { studioConfig } from "@/sanity/config";
export function Studio() {
  return <NextStudio config={studioConfig} />;
}
