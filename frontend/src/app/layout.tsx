import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export const metadata: Metadata = {
  title: "RecallOps AI",
  description: "AI-powered Incident Response Assistant with Persistent Memory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <TopNav />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative z-10 bg-gradient-to-br from-background via-background/95 to-background/50">
              <div className="mx-auto max-w-7xl w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
