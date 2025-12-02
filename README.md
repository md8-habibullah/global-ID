# MD. HABIBULLAH SHARIF - Portfolio

A high-performance, scalable, and secure personal portfolio website designed for a Full-Stack Developer and DevOps Engineer. Built with the latest web technologies including Next.js 16, TypeScript, and Tailwind CSS, focusing on clean architecture, interactivity, and modern design aesthetics.


## Features

-   **Modern Tech Stack:** Built on **Next.js 16 (App Router)** and **React 19** for optimal performance and SEO.
-   **Advanced Styling:** Utilizes **Tailwind CSS 4** with a custom design system using OKLCH color spaces for vibrant dark/light modes.
-   **Interactive UI:**
    -   **Target Cursor:** A custom, performance-optimized magnetic cursor effect powered by **GSAP**, featuring lazy loading for mobile performance.
    -   **Hacker Text:** A decoding text effect for headings to emphasize the security/tech theme.
    -   **Animations:** Smooth transitions and scroll effects using **Framer Motion** and `tailwindcss-animate`.
-   **SEO Optimized:** Includes dynamic metadata, `sitemap.xml`, `robots.txt`, and JSON-LD structured data for rich search results.
-   **Performance:**
    -   **Lazy Loading:** Heavy interactive elements (like the custom cursor) are dynamically imported to reduce the main thread payload on mobile devices.
    -   **Image Optimization:** Next.js Image optimization for fast LCP and efficient format delivery (WebP/AVIF).
-   **Responsive Design:** Fully responsive layout compatible with all device sizes, featuring a custom mobile navigation menu.

## Technology Stack

### Core
-   **Framework:** Next.js 16
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS 4, CSS Variables

### UI & Animations
-   **Libraries:** Framer Motion, GSAP
-   **Icons:** Lucide React
-   **Components:** Radix UI primitives (via Shadcn UI pattern)

### DevOps & Quality
-   **Package Manager:** pnpm
-   **Linting:** ESLint
-   **Deployment:** Vercel / Static Export compatible

## Project Structure

```bash
├── app/                # Next.js App Router pages and layouts
│   ├── layout.tsx      # Root layout with ThemeProvider & CursorLoader
│   ├── page.tsx        # Main landing page composition
│   └── globals.css     # Global styles and Tailwind directives
├── components/         # Reusable UI components
│   ├── ui/             # Base UI elements (buttons, cards, etc.)
│   ├── cursor-loader.tsx # Dynamic loader for the custom cursor
│   ├── mouse-cursor.tsx  # GSAP-powered custom cursor logic
│   └── ...             # Sections (Hero, About, Skills, Projects)
├── lib/                # Utility functions (e.g., cn class merger)
└── public/             # Static assets (images, icons, robots.txt)
````

## Getting Started

### Prerequisites

Ensure you have **Node.js** installed. This project uses `pnpm` for efficient package management.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/md8-habibullah/global-id.git](https://github.com/md8-habibullah/global-id.git)
    cd global-id
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## Scripts

  - `pnpm dev`: Starts the development server with hot reloading.
  - `pnpm build`: Creates an optimized production build.
  - `pnpm start`: Runs the production server.
  - `pnpm lint`: Runs ESLint to catch code quality issues.

## Author

**MD. HABIBULLAH SHARIF**
*Full-Stack Developer & DevOps Engineer*

  - **GitHub:** [@md8-habibullah](https://github.com/md8-habibullah)
  - **LinkedIn:** [@md-habibullahs](https://linkedin.com/in/md-habibullahs)
  - **Email:** hello@habibullah.dev

  ##