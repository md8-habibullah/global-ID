"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronDown } from "lucide-react"

import galleryData from "./data/gallery-data.json"

// Type matches our JSON structure
type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  date: string;
  width: number;
  height: number;
  category: "blessings" | "memories" | string;
}

const ITEMS_PER_PAGE = 12;

export default function AchievementsGallery() {
  const [activeTab, setActiveTab] = useState<"blessings" | "memories">("blessings")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  
  // Track how many items are visible per tab category to prevent huge DOM bloat
  const [visibleCounts, setVisibleCounts] = useState({ "blessings": ITEMS_PER_PAGE, memories: ITEMS_PER_PAGE })

  // Memoize the filtered and strictly sorted data by name (alphabetically)
  const filteredData = useMemo(() => {
    return (galleryData as GalleryItem[])
      .filter(item => item.category === activeTab)
      .sort((a, b) => a.alt.localeCompare(b.alt))
  }, [activeTab])

  // Get exactly the slice of data we want the browser DOM to render
  const visibleData = filteredData.slice(0, visibleCounts[activeTab])
  const hasMore = visibleCounts[activeTab] < filteredData.length

  const handleLoadMore = () => {
    setVisibleCounts(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + ITEMS_PER_PAGE
    }))
  }

  // Handle tab switching, guaranteeing scroll memory doesn't break
  const handleTabSwitch = (tab: "blessings" | "memories") => {
    setActiveTab(tab)
  }

  // Generate Automated JSON-LD for bulletproof Image SEO Indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "MD. HABIBULLAH SHARIF - Professional Blessings & Memories",
    "description": "A curated visual collection of professional tech milestones and memories.",
    "url": "https://habibullah.dev/#gallery",
    "image": (galleryData as GalleryItem[]).map(img => ({
      "@type": "ImageObject",
      "contentUrl": `https://habibullah.dev${img.src}`,
      "name": img.alt,
      "datePublished": img.date
    }))
  };

  return (
    <section id="gallery" className="py-6 md:py-8 relative overflow-hidden bg-background/50">
      {/* Dynamic SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Gallery</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            A visual overview of my technical milestones and personal moments.
          </p>

          {/* Premium Glassmorphic Tab Switcher */}
          <div className="flex justify-center mb-5">
            <div className="relative flex p-1 bg-muted/40 backdrop-blur-md rounded-full border border-white/10 shadow-inner overflow-hidden">
              <button
                onClick={() => handleTabSwitch("blessings")}
                className={`relative z-10 px-6 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "blessings" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Blessings
                {activeTab === "blessings" && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch("memories")}
                className={`relative z-10 px-6 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === "memories" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Memories
                {activeTab === "memories" && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Masonry Grid wrapped in AnimatePresence for smooth tab switching */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 space-y-3"
          >
            {visibleData.length > 0 ? (
              visibleData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index % ITEMS_PER_PAGE * 0.05 }}
                  className="relative group overflow-hidden rounded-xl cursor-pointer break-inside-avoid bg-muted/20 border border-white/5"
                  onClick={() => setSelectedImage(item)}
                >
                  <div 
                    style={{ position: "relative", width: "100%", aspectRatio: `${item.width} / ${item.height}` }}
                  >
                    {/* Utilizing Next.js highly cacheable and optimized image tags to minimize network overload */}
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      loading={index < 8 ? "eager" : "lazy"}
                    />
                  </div>

                  {/* Dynamic Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium truncate drop-shadow-md mb-1">{item.alt}</p>
                      <div className="flex items-center text-white/70 text-xs shadow-sm">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(item.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground w-full">
                No items found for this category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button matching theme for robust future-scaling */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground transition-all duration-300 shadow-sm border border-border"
            >
              Load More Gallery
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col justify-center items-center p-0 border-none bg-black/95 sm:rounded-none backdrop-blur-xl">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
            >
              <div 
                className="relative max-w-full max-h-full flex flex-col justify-center"
                style={{ 
                  aspectRatio: `${selectedImage.width} / ${selectedImage.height}`,
                  maxHeight: '85vh'
                }}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="object-contain w-full h-full max-h-[85vh] rounded-md shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center text-white z-50">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full text-sm flex flex-col items-center shadow-lg">
                  <span className="font-semibold mb-0.5">{selectedImage.alt}</span>
                  <div className="flex items-center text-white/70 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(selectedImage.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
