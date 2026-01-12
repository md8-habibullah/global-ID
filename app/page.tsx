import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-background cursor-target">
      <Header />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Footer />
      <FloatingContact />
    </main>
  )
}