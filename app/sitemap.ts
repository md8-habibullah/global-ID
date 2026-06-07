import type { MetadataRoute } from "next";

interface BlogPost {
  id: number;
  slug: string;
  published_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(
    "https://dev.to/api/articles?username=md8_habibullah",
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://habibullah.dev";

  // Static routes
  const staticRoutes = [
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
    "/articles", // Include articles index
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : route === "/articles" ? 0.9 : 0.8,
  }));

  // Dynamic blog posts
  const posts = await getBlogPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
