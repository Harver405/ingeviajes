import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/url";

/* sitemap.xml: las páginas públicas del sitio. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}