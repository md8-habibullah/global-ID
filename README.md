# GLOBAL_ID // MD. HABIBULLAH SHARIF PORTFOLIO

> SYSTEM STATUS: ONLINE
> KERNEL: NEXT.JS / REACT
> ARCHITECTURE: SCALABLE / SECURE

A high-performance, cinematic personal portfolio engineered for a Full-Stack Developer and DevOps specialist. This project transcends traditional portfolio design by implementing a "System OS" interface, featuring real-time physics simulations, extensive animations, and a security-first aesthetic.

## System Overview

This application is built as a Single Page Application (SPA) experience using the Next.js App Router. It leverages the latest web capabilities including React 19 Server Components, Tailwind CSS v4 alpha/beta features, and hardware-accelerated animations via GSAP and Framer Motion.

## Key Features

### Core Architecture
- **Next.js 16 & React 19:** Utilizes the latest stable release for cutting-edge performance, Server Actions, and optimal SEO.
- **Tailwind CSS 4:** Implements the newest Tailwind engine for instant build times and CSS-variable based theming.
- **Strict TypeScript:** 100% type safety across components and hooks.

### Interactive "System" Modules
- **Cinematic Kernel Boot:** A custom `Preloader` component simulating a DevOps system initialization with a rotating 3D reactor core and real-time log streaming.
- **HUD Scroll System:** A physics-based `ScrollProgress` widget. Features dual-sided docking (drag-to-snap), liquid-fill visualization, and local storage persistence for user preference.
- **Magnetic Cursor:** A GSAP-powered custom cursor with inertial lag and hover state detection.
- **Hacker Text Decoding:** Text scrambling algorithms used for headers to reinforce the security engineering persona.

### UI & UX
- **Radix UI Primitives:** Accessible, headless UI components (Dialogs, Accordions, Tooltips) styled via Shadcn patterns.
- **Physics Animations:** Complex layout transitions using `framer-motion` springs and layout projection.
- **Dynamic Theming:** Seamless Dark/Light mode switching with `next-themes`.
- **Performance:** Optimized LCP via lazy-loaded heavy interactive islands and `next/image` optimization using WebP/AVIF.

## Technology Stack

### Core Framework
- **Runtime:** Node.js
- **Framework:** Next.js 16.0.7
- **Library:** React 19.2.0
- **Language:** TypeScript 5

### Styling & Design System
- **Engine:** Tailwind CSS 4.1.9
- **Processor:** PostCSS 8.5
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
- **Icons:** Lucide React

### Animation & Physics
- **Orchestration:** Framer Motion (latest)
- **High-Perf Animation:** GSAP 3.13.0
- **CSS Animation:** `tailwindcss-animate`, `tw-animate-css`

### Components & State
- **Headless UI:** Radix UI (@radix-ui/react-*)
- **Notifications:** Sonner
- **Drawer:** Vaul
- **Command Palette:** CMDK

### Forms & Validation
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod

## Directory Structure

```text
├── app/                  # Next.js App Router & Route Groups
│   ├── blog/             # Blog section routes
│   ├── kits/             # UI component showcase/kits routes
│   ├── globals.css       # Global styles (Tailwind 4 & CSS Variables)
│   ├── layout.tsx        # Root layout (Theme, Fonts, Metadata, Toaster)
│   ├── loading.tsx       # Cinematic "System Kernel" Preloader
│   ├── not-found.tsx     # Custom 404 "System Error" page
│   ├── page.tsx          # Main Portfolio Landing Page
│   ├── robots.ts         # Dynamic SEO Robots configuration
│   └── sitemap.ts        # Dynamic Sitemap generation
├── components/           # Modular React Components
│   ├── ui/               # Base primitives (Button, Dialog, Tooltip, etc.)
│   ├── HackerText.jsx    # Decrypting text effect component
│   ├── SiteFakeUptime.jsx # Simulated system uptime logic
│   ├── about.tsx         # "System Logs" (Bio) section
│   ├── experience.tsx    # "Timeline" section
│   ├── floating-contact.tsx # Fixed contact action button
│   ├── footer.tsx        # Global footer with real-time clock & system stats
│   ├── header.tsx        # Top navigation bar
│   ├── hero.tsx          # Landing section with FaceID Scanner effect
│   ├── mouse-cursor.tsx  # GSAP-powered custom magnetic cursor
│   ├── project-card.tsx  # Interactive project cards with hover physics
│   ├── projects.tsx      # Projects grid section
│   ├── roadmap.tsx       # "Evolution Path" learning visualization
│   ├── scroll-progress.tsx # Draggable D-Shape System HUD (Liquid Fill)
│   ├── skills.tsx        # "Modules" section with animated progress bars
│   └── theme-provider.tsx # Next-themes context wrapper
├── lib/                  # Utilities (Class merging, helpers)
└── public/               # Static assets (Images, Resume PDF, Icons)

```

## Installation Protocols

### Prerequisites

* Node.js (Latest LTS recommended)
* pnpm (Package Manager)

### Setup Sequence

1. Clone the repository:
```bash
git clone https://github.com/md8-habibullah/global-id.git
cd global-id

```


2. Install dependencies:
```bash
pnpm install

```


3. Initialize development environment:
```bash
pnpm dev

```


4. Access the system:
Open http://localhost:3000 in your browser.

## Build & Deployment

To generate a production-ready build artifact:

```bash
# Compile and optimize
pnpm build

# Preview the production build locally
pnpm start

```

## Quality Control

* **Linting:** `pnpm lint` (ESLint configuration)
* **Type Checking:** Strict mode enabled via `tsconfig.json`

## Author

**MD. HABIBULLAH SHARIF**
Full-Stack Developer & DevOps Engineer

* GitHub: https://github.com/md8-habibullah
* LinkedIn: https://linkedin.com/in/md-habibullahs
* Email: hello@habibullah.dev

---

> END OF FILE
> SYSTEM_LINK :: DISCONNECTED

```
