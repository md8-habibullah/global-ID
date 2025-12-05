import HackerText from "./HackerText"
import { Github, Linkedin, Mail, Facebook, MessageCircle } from "lucide-react"
import Image from "next/image" // <--- Import Next.js Image

// ... keep socialLinks array exactly as is ...
const socialLinks = [
  { href: "https://go.habibullah.dev/github/", label: "GitHub", Icon: Github },
  { href: "https://go.habibullah.dev/linkedin/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://go.habibullah.dev/facebook/", label: "Facebook", Icon: Facebook },
  { href: "https://go.habibullah.dev/whatsapp/", label: "WhatsApp", Icon: MessageCircle },
  { href: "mailto:hello@habibullah.dev", label: "Email", Icon: Mail },
]

export default function Hero() {
  return (
    <section className="section-spacing min-h-[calc(100vh-80px)] flex items-center justify-center cursor-target">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl w-full cursor-target">
        {/* Left: Profile Image */}
        <div className="flex justify-center md:justify-end animate-fade-in-up cursor-target" style={{ animationDelay: "0.1s" }}>
          <div className="relative cursor-target w-56 h-56 md:w-64 md:h-64">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl animate-pulse-slow" />
            
            {/* OPTIMIZED IMAGE COMPONENT */}
            <Image
              src="https://avatars.githubusercontent.com/u/149287500?v=4&s=400" // Increased quality slightly
              alt="MD. HABIBULLAH SHARIF"
              className="profile-pic animate-float-up border border-primary/50 rounded-2xl shadow-lg relative z-10"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority // <--- Crucial for LCP Score
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-8 animate-fade-in-up cursor-target" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-4">
            <div className="accent-line" />
            <h1 className="section-title cursor-target">
              MD. HABIBULLAH
              <br />
              <span className="text-primary">SHARIF</span>
            </h1>

            <HackerText
              text="Full-Stack Developer & Security Enthusiast--"
              className="text-xl sm:text-2xl font-semibold text-muted-foreground font-mono cursor-target"
            />
          </div>
          
          <p className="section-subtitle text-base sm:text-lg cursor-target">
            Building scalable, secure web applications with modern technologies. Full-stack development expertise
            combined with DevOps automation and security-first mindset. Computer Science student from Northern
            University Bangladesh.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#projects" className="fire-button group">
              <span className="relative z-10">View My Work</span>
            </a>
            <a
              href="https://github.com/md8-habibullah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              GitHub Profile
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-8">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative flex items-center rounded-full border border-border/50 bg-card p-2 text-muted-foreground
                           transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 hover:shadow-lg overflow-hidden"
              >
                <Icon className="w-6 h-6 flex-shrink-0 transition-colors duration-300 group-hover:text-white group-hover:animate-glow-pulse" />
                <span className="ml-0 max-w-0 opacity-0 whitespace-nowrap font-mono font-semibold transition-all duration-300
                                 group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100">
                  {label}
                </span>
                <span className="absolute right-2 opacity-0 group-hover:opacity-100 animate-blink">_</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}