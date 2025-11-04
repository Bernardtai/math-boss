import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginButton } from "@/components/auth/LoginButton";
import { GlobalNavigation, MobileNavigation } from "@/components/ui/GlobalNavigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Boss - Master Math with the Asian Method",
  description: "Gamified math learning platform using proven Asian teaching methods. Master addition, subtraction, multiplication, and division through interactive lessons and challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="math-boss-theme"
        >
          <header className="bg-background/95 backdrop-blur-sm border-b border-border fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                    Math Boss
                  </Link>
                  <GlobalNavigation />
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <UserMenu />
                </div>
              </div>
            </div>
            <MobileNavigation />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
