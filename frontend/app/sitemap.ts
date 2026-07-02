import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://innoversely.com";

  // Core storefront routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/return-policy",
    "/warranty",
    "/payment-policy",
    "/privacy",
    "/cookie-policy",
    "/terms",
  ];

  const sitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return sitemapEntries;
}
