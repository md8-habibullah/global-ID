"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronDown, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react"

import galleryData from "./data/gallery-data.json"
import { Button } from "@/components/ui/button"
import { getSecureRandom } from "@/lib/crypto-utils"

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

const shuffleArray = (array: GalleryItem[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Optimized Component: Interactive Card ---
const InteractiveCard = ({ item, index, onClick }: { item: GalleryItem, index: number, onClick: () => void }) => {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="relative group block overflow-hidden bg-muted/5 rounded-2xl md:rounded-[2rem] border border-white/5 cursor-pointer break-inside-avoid shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30"
      onClick={onClick}
    >
      <div
        style={{ position: "relative", width: "100%", aspectRatio: `${item.width} / ${item.height}` }}
        className="overflow-hidden"
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
          priority={index < 2}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <p className="text-white font-bold text-sm md:text-base leading-tight mb-1 drop-shadow-md">{item.alt}</p>
        <div className="flex items-center text-white/70 text-[10px] md:text-xs">
          <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
          {new Date(item.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short'
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default function AchievementsGallery() {
  const [activeTab, setActiveTab] = useState<"blessings" | "memories">("blessings")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [visibleCounts, setVisibleCounts] = useState({ "blessings": ITEMS_PER_PAGE, memories: ITEMS_PER_PAGE })

  const [shuffledData, setShuffledData] = useState<Record<string, GalleryItem[]>>({
    blessings: [],
    memories: []
  })
  const [isClient, setIsClient] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    const bless = (galleryData as GalleryItem[]).filter(item => item.category === "blessings")
    const mem = (galleryData as GalleryItem[]).filter(item => item.category === "memories")

    setShuffledData({
      blessings: shuffleArray(bless),
      memories: shuffleArray(mem)
    })
    setIsClient(true)
  }, [])

  const currentGallery = shuffledData[activeTab]
  const visibleData = isClient ? currentGallery.slice(0, visibleCounts[activeTab]) : []
  const hasMore = isClient && visibleCounts[activeTab] < currentGallery.length

  const handleLoadMore = () => {
    setVisibleCounts(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + ITEMS_PER_PAGE
    }))
  }

  const handleTabSwitch = (tab: "blessings" | "memories") => {
    setActiveTab(tab)
  }

  // --- Expert Modal Logic: Navigation ---
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : currentGallery.length - 1))
  }, [selectedIndex, currentGallery])

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev !== null && prev < currentGallery.length - 1 ? prev + 1 : 0))
  }, [selectedIndex, currentGallery])

  // Keyboard support for expert feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, handlePrev, handleNext])

  const selectedImage = selectedIndex !== null ? currentGallery[selectedIndex] : null

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-5 md:py-10 relative overflow-hidden bg-transparent selection:bg-primary selection:text-primary-foreground"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-primary/3 rounded-full blur-[80px]" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight uppercase">
            Captured <span className="text-primary italic">Moments</span>
          </h2>

          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            A randomized visual timeline of technical growth and personal milestones.
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative flex p-1 bg-muted/20 backdrop-blur-md rounded-full border border-border/50">
              <button
                onClick={() => handleTabSwitch("blessings")}
                className={`relative z-10 px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 rounded-full uppercase tracking-widest ${activeTab === "blessings" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Blessings
                {activeTab === "blessings" && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>

              <button
                onClick={() => handleTabSwitch("memories")}
                className={`relative z-10 px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 rounded-full uppercase tracking-widest ${activeTab === "memories" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Memories
                {activeTab === "memories" && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isClient ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 md:gap-4 space-y-3 md:space-y-4"
            >
              {visibleData.map((item, index) => (
                <InteractiveCard
                  key={`${activeTab}-${item.id}`}
                  item={item}
                  index={index}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Unified Tech-Styled Load More Button --- */}
        {hasMore && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-6">
            <div className="relative group">
              {/* Decorative Tech logic: outer brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors duration-500" />

              <button
                onClick={handleLoadMore}
                className="fire-button relative px-10 py-4 flex items-center gap-3 group"
              >
                {/* Shimmer effect already handled by fire-button in globals.css, 
                    but adding a custom tech icon for more "human visible" feedback */}
                <span className="text-xs font-black tracking-[0.3em] uppercase">
                  Expand Visual Archive
                </span>
                <div className="w-8 h-px bg-primary-foreground/30 group-hover:w-12 transition-all duration-500" />
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-500" />
              </button>
            </div>

            {/* Sub-label: System Status / Counter */}
            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                LOAD_STATE: STABLE
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span>SYNCED: {visibleData.length} // {currentGallery.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* --- Expert-Level 10y Redesigned Lightbox Architecture --- */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent
          className="max-w-full w-full max-h-screen h-screen flex flex-col justify-center items-center p-0 border-none bg-black/90 backdrop-blur-3xl z-[999] outline-none overflow-hidden"
          showCloseButton={false} // Custom exit button for expert feel
          overlayClassName="bg-black/40 backdrop-blur-sm"
        >
          <DialogTitle className="sr-only">Image Immersive View</DialogTitle>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden" onClick={() => setSelectedIndex(null)}>

            {/* Top Bar Navigation HUD */}
            <div className="absolute top-0 inset-x-0 h-24 flex items-center justify-between px-6 z-50 pointer-events-none">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full pointer-events-auto">
                <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                  {selectedIndex !== null ? `${selectedIndex + 1} / ${currentGallery.length}` : ""}
                </span>
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="group w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-500 pointer-events-auto shadow-2xl"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Side Navigation HUD */}
            <div className="absolute inset-y-0 left-6 flex items-center z-40 pointer-events-none">
              <button
                onClick={handlePrev}
                className="hidden md:flex w-16 h-16 items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-500 pointer-events-auto shadow-2xl"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-6 flex items-center z-40 pointer-events-none">
              <button
                onClick={handleNext}
                className="hidden md:flex w-16 h-16 items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-500 pointer-events-auto shadow-2xl"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {selectedImage && (
                <motion.div
                  key={selectedImage.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto cursor-default"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                >
                  <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <div className="w-[50vw] h-[50vh] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
                  </div>

                  <div
                    className="relative max-w-[95vw] max-h-[80vh] flex flex-col justify-center rounded-2xl md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 group/img"
                    style={{ aspectRatio: `${selectedImage.width} / ${selectedImage.height}` }}
                  >
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      width={selectedImage.width}
                      height={selectedImage.height}
                      className="object-contain w-full h-full shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Metadata Info HUD */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-8 md:mt-12 text-center"
                  >
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-10 py-5 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                      <h3 className="text-white font-black text-xl md:text-3xl tracking-tighter italic uppercase mb-2">
                        {selectedImage.alt}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-primary">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(selectedImage.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Nav Swipe Hint */}
            <div className="absolute bottom-6 md:hidden text-white/30 text-[10px] font-bold tracking-widest uppercase animate-pulse">
              Tap anywhere else or ESC to close
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
