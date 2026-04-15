"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronDown, Sparkles, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

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

// Utility to reliably shuffle an array
const shuffleArray = (array: GalleryItem[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AchievementsGallery() {
  const [activeTab, setActiveTab] = useState<"blessings" | "memories">("blessings")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [visibleCounts, setVisibleCounts] = useState({ blessings: ITEMS_PER_PAGE, memories: ITEMS_PER_PAGE })
  const [shuffledData, setShuffledData] = useState<Record<string, GalleryItem[]>>({ blessings: [], memories: [] })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const bless = (galleryData as GalleryItem[]).filter(item => item.category === "blessings")
    const mem = (galleryData as GalleryItem[]).filter(item => item.category === "memories")
    setShuffledData({ blessings: shuffleArray(bless), memories: shuffleArray(mem) })
    setIsClient(true)
  }, [])

  const visibleData = isClient ? shuffledData[activeTab].slice(0, visibleCounts[activeTab]) : []
  const hasMore = isClient && visibleCounts[activeTab] < shuffledData[activeTab].length

  const handleLoadMore = () => {
    setVisibleCounts(prev => ({ ...prev, [activeTab]: prev[activeTab] + ITEMS_PER_PAGE }))
  }

  const handleTabSwitch = (tab: "blessings" | "memories") => {
    setActiveTab(tab)
  }

  return (
    <section id="gallery" className="section-spacing relative overflow-hidden bg-background/50 border-t border-border/50">
      {/* Background Grid - Matching Projects Theme */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em]">
              <Terminal className="w-4 h-4" />
              <span>system.archives.visualizer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Captured <span className="text-primary italic">Moments</span>
            </h2>
          </div>

          {/* Theme-Synced Tabs */}
          <div className="flex p-1 bg-muted/20 backdrop-blur-md rounded-lg border border-border/50 shadow-sm">
            {["blessings", "memories"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabSwitch(tab as any)}
                className={`relative px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-md ${
                  activeTab === tab ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Performance-Optimized Grid */}
        <AnimatePresence mode="wait">
          {!isClient ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4"
            >
              {visibleData.map((item, index) => (
                <motion.div
                  key={`${activeTab}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: (index % 6) * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="relative group overflow-hidden bg-card rounded-xl border border-border shadow-sm cursor-pointer break-inside-avoid transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                  onClick={() => setSelectedImage(item)}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: `${item.width} / ${item.height}` }}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={index < 8 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-[10px] md:text-xs text-white font-mono uppercase tracking-wider mb-1 truncate">{item.alt}</p>
                    <div className="flex items-center text-white/60 text-[8px] md:text-[10px]">
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hacker-Style Button Sync */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 bg-primary/5 text-primary font-mono text-sm hover:bg-primary/10 hover:border-primary transition-all duration-300 relative overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">&gt; fetch next_gallery_batch</span>
              <ChevronDown className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] bg-black/95 border-border/50 backdrop-blur-xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Visual Detail</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-background/80 backdrop-blur-md border border-border px-5 py-2 rounded-full flex flex-col items-center">
                  <span className="font-mono text-[10px] md:text-sm uppercase tracking-widest">{selectedImage.alt}</span>
                  <div className="flex items-center text-muted-foreground text-[8px] md:text-[10px] uppercase mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(selectedImage.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
