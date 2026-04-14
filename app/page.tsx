import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import AchievementsGallery from "@/components/achievements-gallery"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import Roadmap from "@/components/roadmap"

export default function Home() {
  return (
    // bg-background commented out to remove solid background color
    <main className="min-h-screen  cursor-target">
      <Header />
      <Hero />
      <About />
      <AchievementsGallery />
      <Experience />
      <Skills />
      <Projects />
      <Roadmap />
      <Footer />
      <FloatingContact />
    </main>
  )
}