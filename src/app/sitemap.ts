import type { MetadataRoute } from "next";
import { questions } from "@/data/questions";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...questions.filter((question) => question.active).map((question) => ({ url: `${baseUrl}/q/${question.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
