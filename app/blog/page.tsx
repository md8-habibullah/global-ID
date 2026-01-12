import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Terminal, Calendar, Clock, ArrowRight, Tag } from "lucide-react";

// Types for Dev.to API
interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
  cover_image: string | null;
  positive_reactions_count: number;
  url: string;
}

// Fetch posts from Dev.to
async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(
    "https://dev.to/api/articles?username=md8_habibullah",
    { next: { revalidate: 3600 } }, // Cache for 1 hour (ISR)
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export const metadata = {
  title: "Blog | MD. Habibullah Sharif",
  description:
    "Technical articles, tutorials, and insights on Full-Stack Development & DevOps.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
      {/* Header Section */}
      <div className="mb-12 border-b border-border/40 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-mono">
            ~/blog<span className="animate-pulse text-primary">_</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Documenting my journey through code, infrastructure, and bugs. Written
          for developers, by a developer.
        </p>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="group flex flex-col h-full bg-card/40 border border-border/50 rounded-xl overflow-hidden hover:border-primary/40 hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {/* Image Container */}
            <div className="aspect-video relative w-full bg-muted/20 overflow-hidden">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Terminal className="w-12 h-12 text-primary/20" />
                </div>
              )}

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {post.tag_list.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-background/80 backdrop-blur-md border border-border/50 rounded text-foreground/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.published_at), "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.reading_time_minutes} min read
                </span>
              </div>

              <h2 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                {post.description}
              </p>

              <div className="flex items-center text-sm font-medium text-primary mt-auto">
                <span className="relative">
                  read_post()
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                </span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
