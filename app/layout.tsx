import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
// import { GoogleTagManager } from "@next/third-parties/google"; // Uncomment if you have a GTM ID
// import MouseCursor from "@/components/mouse-cursor";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/scroll-progress";
import GlobalSpider from "@/components/global-spider";
import GlobalBackground from "@/components/global-background";
import Script from 'next/script'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// === SEO & SOCIAL CONFIGURATION ===
export const metadata: Metadata = {
  metadataBase: new URL("https://habibullah.dev"),
  applicationName: "HABIBULLAH's Portfolio",
  title: {
    default: "MD. HABIBULLAH SHARIF - Full-Stack Developer & DevOps Engineer",
    template: "%s | HABIBULLAH's Portfolio"
  },
  description:
    "Full-Stack Developer & DevOps Engineer specializing in scalable applications, infrastructure automation, and Linux systems. Building secure, performant solutions with React, Node.js, Docker, and Kubernetes.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
  },
  keywords: [
    "Full-Stack Developer",
    "habibullah dev",
    "DevOps Engineer",
    "React Developer",
    "Node.js",
    "Docker",
    "Kubernetes",
    "Linux",
    "Infrastructure",
    "CI/CD",
    "MD. HABIBULLAH SHARIF",
    "Bangladesh Developer"
  ],
  authors: [{ name: "MD. HABIBULLAH SHARIF", url: "https://habibullah.dev" }],
  creator: "MD. HABIBULLAH SHARIF",
  generator: "Next.js 16",
  robots: "index, follow",

  // Facebook / LinkedIn Previews
  openGraph: {
    title: "MD. HABIBULLAH SHARIF - Full-Stack Developer & DevOps Engineer",
    description:
      "Crafting scalable applications and robust infrastructure with modern technologies.",
    url: "https://habibullah.dev",
    siteName: "HABIBULLAH's Portfolio", // This matches your desired Site Name
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/149287500?s=1200",
        width: 1200,
        height: 630,
        alt: "MD. HABIBULLAH SHARIF",
      },
    ],
  },

  // Twitter / X Previews
  twitter: {
    card: "summary_large_image",
    title: "MD. HABIBULLAH SHARIF - Full-Stack Developer",
    description:
      "Full-Stack Developer & DevOps Engineer | React, Node.js, Docker, Kubernetes",
    images: ["https://avatars.githubusercontent.com/u/149287500?s=1200"],
  },
};

// === STRUCTURED DATA (JSON-LD) ===
// We use an array to define multiple schemas:
// 1. WebSite: Tells Google the specific NAME of your site (Fixes the favicon label issue)
// 2. Person: Connects the site to your personal identity (Knowledge Graph)

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HABIBULLAH's Portfolio", // <--- THIS is what shows next to the favicon
    "alternateName": ["MD. HABIBULLAH SHARIF", "Habibullah Dev"],
    "url": "https://habibullah.dev"
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "MD. HABIBULLAH SHARIF",
    "url": "https://habibullah.dev",
    "image": "https://avatars.githubusercontent.com/u/149287500?s=800",
    "jobTitle": "Full-Stack Developer & DevOps Engineer",
    "sameAs": [
      "https://github.com/md8-habibullah",
      "https://www.linkedin.com/in/md-habibullahs",
      "https://dev.to/md8_habibullah",
      "https://medium.com/@md8.habibullah",
      "https://x.com/md8_habibullah",
      "https://www.facebook.com/md8.habibullah",
      "https://www.instagram.com/md8.habibullah/",
      "https://habibullah.dev/blog",
      "https://habibullah.dev",
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dhaka",
      "addressCountry": "Bangladesh"
    }
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground">

        {/* Inject JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* === 1. GLOBAL BACKGROUND & SPIDER (z-index: 0) === */}
          <GlobalBackground />
          <GlobalSpider color="0, 255, 200" />

          {/* <MouseCursor /> */}
          <ScrollProgress />

          {/* === 2. CONTENT WRAPPER (z-index: 10) === */}
          <div className="relative z-10">
            {children}

            <Script
              src="https://cdn.jsdelivr.net/gh/md8-habibullah/webapp-launcher@main/launcher.js"
              strategy="lazyOnload"
            />
          </div>

          <Toaster
            position="top-center"
            theme="dark"
            richColors
            closeButton
            duration={3000}
          />
        </ThemeProvider>
        <SpeedInsights />

        {/* Google Analytics can go here if needed */}
        {/* <GoogleTagManager gtmId="GTM-XXXXXX" /> */}
      </body>
    </html>
  );
}