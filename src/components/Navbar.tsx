"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="glass-panel border-x-0 border-t-0 bg-white/80 backdrop-blur-md">
        <div className="container-custom flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo variant="nav" size={48} showText />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-navy">
            <Link href="/urunler" className="hover:text-brand transition-colors duration-200">
              ÜRÜNLER
            </Link>
            <Link href="/hakkimizda" className="hover:text-brand transition-colors duration-200">
              HAKKIMIZDA
            </Link>
            <Link href="/iletisim" className="hover:text-brand transition-colors duration-200">
              İLETİŞİM
            </Link>
            <Link
              href="/giris"
              className="px-5 py-2.5 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all duration-300 font-bold"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Content */}
        {isOpen && (
          <div className="md:hidden border-t border-navy/5 bg-white px-6 py-4 space-y-4">
            <Link
              href="/urunler"
              className="block text-sm font-semibold text-navy hover:text-brand"
              onClick={() => setIsOpen(false)}
            >
              ÜRÜNLER
            </Link>
            <Link
              href="/hakkimizda"
              className="block text-sm font-semibold text-navy hover:text-brand"
              onClick={() => setIsOpen(false)}
            >
              HAKKIMIZDA
            </Link>
            <Link
              href="/iletisim"
              className="block text-sm font-semibold text-navy hover:text-brand"
              onClick={() => setIsOpen(false)}
            >
              İLETİŞİM
            </Link>
            <Link
              href="/giris"
              className="inline-block px-5 py-2 rounded-full bg-brand/10 text-brand font-bold text-sm"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
