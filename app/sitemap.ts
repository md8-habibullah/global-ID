import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://habibullah.dev";

  const routes = [
    "",
    "/kits",
    "/kits/age",
    "/kits/currency",
    "/kits/password",
    "/kits/picker",
    "/kits/prayer",
    "/kits/qrcode",
    "/kits/subnet",
    "/kits/system",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  }));
}
