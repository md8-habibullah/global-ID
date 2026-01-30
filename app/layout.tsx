import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import MouseCursor from "@/components/mouse-cursor";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/scroll-progress";
import GlobalSpider from "@/components/global-spider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://habibullah.dev"),
  title:
    "MD. HABIBULLAH SHARIF - Full-Stack Developer & DevOps Engineer | Portfolio",
  description:
    "Full-Stack Developer & DevOps Engineer specializing in scalable applications, infrastructure automation, and Linux systems. Building secure, performant solutions with React, Node.js, Docker, and Kubernetes.",
  alternates: {
    canonical: "/",
  },
  // icons: {
  //   icon: 'https://avatars.githubusercontent.com/u/149287500?v=4&s=300'
  // },
  keywords: [
    "Full-Stack Developer",
    "DevOps Engineer",
    "React Developer",
    "Node.js",
    "Docker",
    "Kubernetes",
    "Linux",
    "Infrastructure",
    "CI/CD",
  ],
  authors: [{ name: "MD. HABIBULLAH SHARIF" }],
  creator: "MD. HABIBULLAH SHARIF",
  generator: "Next.js 16",
  robots: "index, follow",
  openGraph: {
    title: "MD. HABIBULLAH SHARIF - Full-Stack Developer & DevOps Engineer",
    description:
      "Crafting scalable applications and robust infrastructure with modern technologies",
    url: "https://habibullah.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD. HABIBULLAH SHARIF - Full-Stack Developer",
    description:
      "Full-Stack Developer & DevOps Engineer | React, Node.js, Docker, Kubernetes",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {/* ... Head section ... */}

      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* === 1. GLOBAL SPIDER (z-index: 0) === */}
          {/* Sits on top of the background color, but below the text */}
          <GlobalSpider color="0, 255, 200" />

          <MouseCursor />
          <ScrollProgress />

          {/* === 2. CONTENT WRAPPER (z-index: 10) === */}
          {/* This ensures your buttons/text are clickable and above the spider lines */}
          <div className="relative z-10">
            {children}
          </div>

          <Toaster
            position="top-center"
            theme="dark"
            richColors
            closeButton
            duration={3000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}