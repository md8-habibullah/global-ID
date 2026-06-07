"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { format } from "date-fns";
import { ArrowRight, ArrowLeft, Calendar, Clock, Terminal } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utils file, standard in shadcn setup

// Duplicate the interface or import it if you have a types file
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
    user: User;
}

export function BlogFeaturedSlider({ posts }: { posts: BlogPost[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    // Sync state with carousel
    React.useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    const scrollPrev = React.useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi]
    );
    const scrollNext = React.useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi]
    );

    if (posts.length === 0) return null;

    return (
        <div className="relative group mb-16 cursor-target">
            {/* Decorative Header for the Slider */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2 text-sm font-mono text-primary">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span>Latest_Deployments</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollPrev}
                        className="p-2 rounded-md border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-2 rounded-md border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Viewport */}
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {posts.map((post, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={post.id}>
                            <Link href={`/articles/${post.slug}`} className="block relative aspect-[21/9] md:aspect-[2.5/1] overflow-hidden group/slide">
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    {post.cover_image ? (
                                        <Image
                                            src={post.cover_image}
                                            alt={post.title}
                                            fill
                                            priority={index === 0}
                                            className="object-cover transition-transform duration-1000 group-hover/slide:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-grid-white/[0.05] bg-[length:20px_20px]" />
                                    )}
                                    {/* Dark Gradient Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent md:bg-gradient-to-r md:from-background md:via-background/60 md:to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10 md:max-w-2xl">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {post.tag_list.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-primary text-primary-foreground rounded-sm font-mono shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white group-hover/slide:text-primary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-none">
                                            {post.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(post.published_at), "MMM d, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {post.reading_time_minutes} min read
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {posts.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => emblaApi?.scrollTo(idx)}
                        className={cn(
                            "h-1.5 transition-all duration-300 rounded-full",
                            idx === selectedIndex
                                ? "w-8 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                                : "w-2 bg-primary/20 hover:bg-primary/40"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}