import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageCircle,
  Heart,
  Terminal,
  User,
  Hash,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";
// import ShareButton from "@/components/share-button";

// === TYPES ===
interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  published_at: string;
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number; // Added
  cover_image: string | null;
  tags: string[]; // Note: In single post API, 'tags' is the array, 'tag_list' is a string
  url: string;
  canonical_url: string;
  body_html: string;

  user: {
    name: string;
    profile_image_90: string;
  };
}

// === API FETCH ===
async function getPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(
    `https://dev.to/api/articles/md8_habibullah/${slug}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) return null;
  return res.json();
}

// === DYNAMIC METADATA ===
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post Not Found" };

  // const url = `https://habibullah.dev/blog/${slug}`;
  const localUrl = `https://habibullah.dev/blog/${slug}`;

  return {
    title: `${post.title} | MD. Habibullah Sharif`,
    description: post.description,
    keywords: post.tags.join(", "),
    authors: [{ name: post.user.name }],
    alternates: { canonical: post.canonical_url },
    openGraph: {
      title: post.title,
      description: post.description,
      url: localUrl,
      siteName: "Habibullah.dev",
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.published_at, // Assuming no edits
      authors: [post.user.name],
      images: post.cover_image
        ? [{ url: post.cover_image, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// === PAGE COMPONENT ===
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 cursor-target py-12">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-8 cursor-target">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          cd .. || go back
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground/50 cursor-target">
          <Terminal className="w-3 h-3" />
          <span>/blog/{slug.substring(0, 20)}...</span>
        </div>
      </div>

      <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* === HEADER STATS === */}
        <div className="space-y-6 mb-10 cursor-target">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 cursor-target">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/5 border border-primary/20 rounded font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author & Meta Grid */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/40 text-sm cursor-target">
            {/* Author */}
            <div className="flex items-center gap-3 pr-6 sm:border-r border-border/40 cursor-target">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 cursor-target">
                <Image
                  src={post.user.profile_image_90}
                  alt={post.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col leading-none gap-1 cursor-target">
                <span className="font-bold text-foreground">
                  {post.user.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  AUTHOR
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-muted-foreground cursor-target">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.published_at), "MMM d, yyyy")}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2 text-muted-foreground cursor-target">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time_minutes} min read</span>
            </div>

            {/* Stats Badge */}
            <div className="ml-auto flex items-center gap-4 cursor-target">
              <div className="flex items-center gap-1.5 text-red-400 font-mono text-xs bg-red-500/5 px-2 py-1 rounded-full border border-red-500/10 cursor-target">
                <Heart className="w-3.5 h-3.5" />
                <span>{post.public_reactions_count}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-xs bg-blue-500/5 px-2 py-1 rounded-full border border-blue-500/10 cursor-target">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.comments_count}</span>
              </div>
              {/* <ShareButton slug={post.slug} /> */}
            </div>
          </div>
        </div>
        {/*SEO content*/}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.description,
              image: post.cover_image ? [post.cover_image] : [],
              datePublished: post.published_at,
              dateModified: post.published_at,
              author: {
                "@type": "Person",
                name: post.user.name,
                image: post.user.profile_image_90,
              },
              publisher: {
                "@type": "Organization",
                name: "Habibullah.dev",
                logo: {
                  "@type": "ImageObject",
                  url: "https://habibullah.dev/logo.png", // Replace with your logo URL
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                // "@id": `https://habibullah.dev/blog/${post.slug}`, 
                "@id": post.url
              },
              wordCount: Math.ceil(post.reading_time_minutes * 200), // Approximate
              keywords: post.tags.join(", "),
            }),
          }}
        />

        {/* === COVER IMAGE === */}
        {post.cover_image && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/40 shadow-2xl mb-12 group cursor-target">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Scanline Effect Overlay (Optional aesthetic) */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none cursor-target" />
          </div>
        )}

        {/* === CONTENT BODY === */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
            prose-p:text-muted-foreground prose-p:leading-8
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-card prose-pre:border prose-pre:border-border/50
            marker:text-primary"
          dangerouslySetInnerHTML={{ __html: post.body_html }}
        />

        {/* === FOOTER === */}
        <div className="mt-16 pt-8 border-t border-border/40 cursor-target">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/30 p-6 rounded-xl border border-border/50 cursor-target">
            <div className="flex flex-col gap-1 cursor-target">
              <h3 className="font-bold text-lg">Enjoyed this article?</h3>
              <p className="text-sm text-muted-foreground">
                Join the discussion on Dev.to or share it with others.
              </p>
            </div>
            <div className="flex items-center gap-3 cursor-target">
              {/* Discuss Button (Keeps pointing to Dev.to) */}
              <Link
                href={post.url}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                Discuss
              </Link>

              {/* NEW Share Button (Copies YOUR local blog URL) */}
              {/* <ShareButton slug={post.slug} /> */}
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground font-mono opacity-50 cursor-target">
            // END_OF_FILE
          </div>
        </div>
      </article>
    </div>
  );
}
