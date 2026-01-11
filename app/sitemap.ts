import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://habibullah.dev";

  const routes = [
    "",
    "/info",
    "/info/age",
    "/info/currency",
    "/info/password",
    "/info/picker",
    "/info/prayer",
    "/info/qrcode",
    "/info/subnet",
    "/info/system",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
