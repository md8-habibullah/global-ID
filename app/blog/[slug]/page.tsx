import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, MessageCircle, Heart } from "lucide-react";

// Fetch single post by slug
async function getPost(slug: string) {
  const res = await fetch(
    `https://dev.to/api/articles/md8_habibullah/${slug}`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | MD. Habibullah`,
    description: post.description,
  };
}

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 cursor-target">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        cd .. || Look Back
      </Link>

      {/* Article Header */}
      <article className="animate-in fade-in slide-in-from-bottom-4 duration-700 cursor-target">
        <div className="space-y-6 mb-10 cursor-target">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono cursor-target">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-card/50">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(post.published_at), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-card/50">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time_minutes} min read
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-card/50 text-red-400">
              <Heart className="w-3.5 h-3.5" />
              {post.public_reactions_count} reactions
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/40 shadow-lg mb-12 cursor-target">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-p:text-muted-foreground prose-p:leading-7
            marker:text-primary cursor-target"
          dangerouslySetInnerHTML={{ __html: post.body_html }}
        />

        {/* Footer of Article */}
        <div className="mt-16 pt-8 border-t border-border/40 flex justify-between items-center cursor-target">
          <Link
            href={post.url}
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Discuss on Dev.to
          </Link>
          <div className="text-sm text-muted-foreground font-mono">
            END_OF_FILE
          </div>
        </div>
      </article>
    </div>
  );
}
