import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="glass-panel border-x-0 border-t-0">
        <div className="container-custom flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo variant="nav" size={48} showText />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-navy">
            <Link href="/urunler" className="hover:text-brand transition-colors duration-200">
              ÜRÜNLER
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
        </div>
      </div>
    </header>
  );
}
