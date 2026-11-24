import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/url";

/* robots.txt: Google puede ver todo menos el panel y las rutas internas. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}