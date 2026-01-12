import Header from "@/components/header";
import Footer from "@/components/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <Header />
      <main className="flex-1 pt-20 pb-16 relative cursor-target">
        {/* Cyber Grid Background for the Blog Section */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none cursor-target"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {children}
      </main>
      <Footer />
    </div>
  );
}
