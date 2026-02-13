import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-semibold">{SITE.name}</div>
            <p className="mt-2 text-sm text-slate-600">
              Toptan ürün tedariki için kurumsal ve hızlı iletişim. Katalog üzerinden ürünleri inceleyin.
            </p>
          </div>

          <div>
            <div className="font-semibold">İletişim</div>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              {SITE.phone && <div>Telefon: {SITE.phone}</div>}
              {SITE.whatsapp && <div>WhatsApp: {SITE.whatsapp}</div>}
              {SITE.address && <div>Adres: {SITE.address}</div>}
            </div>
          </div>

          <div>
            <div className="font-semibold">Kısa Linkler</div>
            <div className="mt-2 space-y-2 text-sm">
              <a className="block text-slate-700 hover:underline" href="/urunler">Ürünler</a>
              <a className="block text-slate-700 hover:underline" href="/iletisim">İletişim</a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
