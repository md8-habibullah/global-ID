"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, ChevronDown, Sparkles } from "lucide-react"

import galleryData from "./data/gallery-data.json"
import { Button } from "@/components/ui/button"

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
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Optimized Component: Interactive Card ---
const InteractiveCard = ({ item, index, onClick }: { item: GalleryItem, index: number, onClick: () => void }) => {
  // We remove the heavy 3D Tilt calculation to save RAM/CPU, using simpler CSS hover instead
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
          unoptimized
        />
      </div>

      {/* Simplified Overlay for Mobile performance */}
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
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
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

  const visibleData = isClient ? shuffledData[activeTab].slice(0, visibleCounts[activeTab]) : []
  const hasMore = isClient && visibleCounts[activeTab] < shuffledData[activeTab].length

  const handleLoadMore = () => {
    setVisibleCounts(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + ITEMS_PER_PAGE
    }))
  }

  const handleTabSwitch = (tab: "blessings" | "memories") => {
    setActiveTab(tab)
  }

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className="py-10 md:py-16 relative overflow-hidden bg-transparent selection:bg-primary selection:text-primary-foreground"
    >
      {/* Optimized Atmosphere - Simple Blurred Blobs */}
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
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Gallery Archive</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight uppercase">
            Captured <span className="text-primary italic">Moments</span>
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-8">
            A randomized visual timeline of technical growth and personal milestones.
          </p>

          {/* Consistent Tab Switcher - Using your theme variable borders */}
          <div className="flex justify-center mb-8">
            <div className="relative flex p-1 bg-muted/20 backdrop-blur-md rounded-full border border-border/50">
              <button
                onClick={() => handleTabSwitch("blessings")}
                className={`relative z-10 px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 rounded-full uppercase tracking-widest ${
                  activeTab === "blessings" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                className={`relative z-10 px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 rounded-full uppercase tracking-widest ${
                  activeTab === "memories" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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

        {/* Improved Mosaic - 2 Columns on Mobile to reduce scroll length */}
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
                  onClick={() => setSelectedImage(item)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More - Using fire-button style for consistency */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="group rounded-full px-8 py-6 h-auto text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:border-primary/50"
            >
              Load More Gallery
              <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent 
          className="max-w-full w-full max-h-screen h-screen flex flex-col justify-center items-center p-0 border-none bg-black/80 backdrop-blur-3xl z-[999] outline-none"
          showCloseButton={true}
          overlayClassName="bg-black/40 backdrop-blur-sm"
        >
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
              <div 
                className="relative max-w-[95vw] max-h-[85vh] flex flex-col justify-center"
                style={{ aspectRatio: `${selectedImage.width} / ${selectedImage.height}` }}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="object-contain w-full h-full rounded-xl shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5"
                  priority
                  unoptimized
                />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
              >
                <span className="inline-block bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full text-white text-sm font-bold uppercase tracking-widest shadow-2xl">
                  {selectedImage.alt}
                </span>
                <p className="mt-2 text-white/30 text-[10px] font-mono tracking-widest uppercase">
                  ESC to close • Click anywhere to exit
                </p>
              </motion.div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
