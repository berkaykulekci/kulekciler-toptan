import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServer();

  const { data: products } = await supabase
    .from("products")
    .select("id,name,slug,description,category,created_at,product_images(image_url,sort_order)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-cream selection:bg-brand/20 selection:text-brand">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-32">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-navy/5 blur-[100px]" />
        </div>

        <div className="container-custom relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/50 px-4 py-1.5 text-sm font-medium text-navy/80 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Gaziantep Toptan Satış
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-navy mb-8 leading-[1.1]">
              Gaziantep <br />
              <span className="text-gradient">Külekçiler Hediyelik</span>
            </h1>

            <p className="text-lg md:text-xl text-navy/70 mb-10 max-w-xl leading-relaxed">
              Külekçiler Toptan olarak Gaziantep merkezli hizmet vermekteyiz.
              Züccaciye, mutfak ürünleri, hediyelik eşya ve hırdavat kategorilerinde geniş ürün çeşitliliği sunuyoruz.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/urunler" className="btn-primary">
                Ürün Kataloğunu İncele
              </Link>
              <Link href="/iletisim" className="btn-secondary">
                İletişim
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-navy/5 pt-8">
              <div>
                <div className="text-3xl font-bold text-navy mb-1">30.000+</div>
                <div className="text-sm font-medium text-navy/60">Ürün çeşitliliği</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy mb-1">1000+</div>
                <div className="text-sm font-medium text-navy/60">Aktif Müşteri</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy mb-1">Gaziantep & Çevre İller</div>
                <div className="text-sm font-medium text-navy/60">Toptan Satış</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Öne Çıkan Ürünler</h2>
              <p className="text-navy/60 max-w-xl">
                En çok tercih edilen ve stoklara yeni giren toptan ürünlerimizi keşfedin.
              </p>
            </div>
            <Link
              href="/urunler"
              className="group flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              Tüm Ürünleri Gör
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <ProductGrid products={products ?? []} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-navy/5 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-navy/60 font-medium">
              © {new Date().getFullYear()} Külekçiler Hediyelik. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-6">
              <Link href="/gizlilik" className="text-sm text-navy/60 hover:text-brand transition-colors">Gizlilik</Link>
              <Link href="/sartlar" className="text-sm text-navy/60 hover:text-brand transition-colors">Şartlar</Link>
              <Link href="/iletisim" className="text-sm text-navy/60 hover:text-brand transition-colors">İletişim</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
