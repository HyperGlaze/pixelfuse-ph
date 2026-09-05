import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PixelFuse PH | Student-focused Pixel Art Accessories",
  description: "Affordable pixel art accessories for students. Keychains, DIY bracelets, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-gray-950 text-gray-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PixelFuse PH. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
