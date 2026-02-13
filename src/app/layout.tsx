import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Külekçiler Hediyelik",
  description: "Gaziantep merkezli 30.000+ ürün çeşitliliği ile toptan satış.",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={outfit.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
