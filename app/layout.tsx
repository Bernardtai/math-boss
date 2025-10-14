import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserMenu } from "@/components/auth/UserMenu";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Math Boss</h1>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
