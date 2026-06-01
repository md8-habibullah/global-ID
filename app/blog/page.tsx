// /app/blog/page.tsx

// export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Terminal,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Hash,
} from "lucide-react";
import type { Metadata } from "next";
import FeaturedCarousel from "@/components/blog/featured-carousel"; // <--- IMPORT THIS

// === TYPES ===
interface User {
  name: string;
  username: string;
  profile_image_90: string;
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
  cover_image: string | null;
  public_reactions_count: number;
  comments_count: number;
  user: User;
  url: string;
}

// === API FETCH ===
async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(
    "https://dev.to/api/articles?username=md8_habibullah",
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    console.error("Failed to fetch Dev.to posts");
    return [];
  }

  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getBlogPosts();

  const title = "Blog | MD. Habibullah Sharif";
  const description =
    "Technical articles, tutorials, and insights on Full-Stack Development & DevOps.";
  const localUrl = "https://habibullah.dev/blog";
  const devToProfile = "https://dev.to/md8_habibullah";

  return {
    title,
    description,
    keywords: [
      "blog",
      "full-stack development",
      "devops",
      "coding",
    ],
    authors: [{ name: "MD. Habibullah Sharif" }],
    alternates: { canonical: devToProfile },
    openGraph: {
      title,
      description,
      url: localUrl,
      images: posts[0]?.cover_image
        ? [{ url: posts[0].cover_image, alt: posts[0].title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: posts[0]?.cover_image ? [posts[0].cover_image] : [],
    },
  };
}

// === MAIN PAGE COMPONENT ===
export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Get top 5 posts for the slider
  const featuredPosts = posts.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-8 cursor-target">
      {/* === HEADER SECTION === */}
      <div className="mb-12 cursor-target">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 cursor-target">
          <div className="space-y-4 cursor-target">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-2 cursor-target">
              {/* <span className="relative flex h-2 w-2 cursor-target">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span> */}
              {/* System_Online: */}
              Fetched Articles...
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-mono">
              ~/blog<span className="animate-pulse text-primary">_</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              <span className="text-primary font-mono mr-2">&gt;</span>
              Documenting my journey through code, infrastructure, and bugs.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 text-sm font-mono text-muted-foreground cursor-target">
            <div className="flex items-center gap-2 cursor-target">
              <Hash className="w-4 h-4" />
              <span>Total Posts: {posts.length}</span>
            </div>
            <div className="h-px w-24 bg-border/50 cursor-target" />
            <div className="cursor-target">
              Latest:{" "}
              {posts[0]?.published_at
                ? format(new Date(posts[0].published_at), "MMM d")
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* === FEATURED SLIDER === */}
      {/* Pass the top 5 posts to the slider */}
      {featuredPosts.length > 0 && (
        <FeaturedCarousel posts={featuredPosts} />
      )}

      {/* Separator */}
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-bold font-mono">Recent Uploads</h3>
        <div className="h-px bg-border/40 flex-1"></div>
      </div>


      {/* === POSTS GRID === */}
      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-xl cursor-target">
          <Terminal className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">
            No packets received. API might be down.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-target">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className="group flex flex-col h-full bg-card md:bg-card/30 md:backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* === COVER IMAGE === */}
              <div className="aspect-video relative w-full bg-muted/20 overflow-hidden cursor-target">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    // Priority only for the very first item if needed, but slider handles LCP now
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors cursor-target">
                    <Terminal className="w-12 h-12 text-primary/20" />
                  </div>
                )}

                {/* Tags Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 cursor-target">
                  {post.tag_list.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md border border-white/10 rounded text-white/90 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* === CARD CONTENT === */}
              <div className="flex flex-col flex-1 p-6 cursor-target">
                {/* Meta Row: Date & Time */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 font-mono cursor-target">
                  <div className="flex items-center gap-3 cursor-target">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(post.published_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground">
                    <Clock className="w-3 h-3" />
                    {post.reading_time_minutes} min
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {post.description}
                </p>

                {/* === FOOTER: Author & Stats === */}
                <div className="pt-5 mt-auto border-t border-border/40 flex items-center justify-between cursor-target">
                  {/* Author Info */}
                  <div className="flex items-center gap-2.5 cursor-target">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border/50 cursor-target">
                      <Image
                        src={post.user.profile_image_90}
                        alt={post.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground/80 font-mono group-hover:text-foreground transition-colors">
                      {post.user.name.slice(0, 25)}{" "}
                    </span>
                  </div>

                  {/* Reactions & Comments */}
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground cursor-target">
                    <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-target">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.public_reactions_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-target">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}