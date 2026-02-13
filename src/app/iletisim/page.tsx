"use client";

import { SITE, whatsappPriceLink } from "@/lib/config";
import BackButton from "@/components/BackButton";

export default function ContactPage() {
  const phoneNumber = "0536 832 48 60";
  const whatsappNumber = "905368324860";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <BackButton />

      <h1 className="text-3xl font-bold text-navy mb-2">İletişim</h1>
      <p className="text-navy/60">Fiyat, stok ve tedarik için hızlıca ulaşın.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="glass-panel rounded-3xl p-8">
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-navy/50 uppercase tracking-wider mb-1">Telefon</div>
              <a className="block text-xl font-bold text-navy hover:text-brand transition-colors" href={`tel:${phoneNumber}`}>
                {phoneNumber}
              </a>
            </div>

            <div>
              <div className="text-sm font-semibold text-navy/50 uppercase tracking-wider mb-1">WhatsApp</div>
              <a
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition-all hover:scale-105"
                target="_blank"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Merhaba, ürünler hakkında bilgi almak istiyorum.")}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.87 3.05.87 4.961 0 7.768-4.108 6.22-8.312-.9-2.222-2.924-2.905-6.464-2.905zm0-2c3.483 0 6.649 1.579 7.917 3.999 2.067 5.092-1.928 10.655-7.85 10.655-1.488 0-2.617-.417-3.924-1.127l-5.174 1.36 1.39-5.048c-.901-1.485-1.353-2.905-1.354-4.84 0-4.28 3.482-7.766 7.766-7.766zm-1.898 3.237c-.161-.318-.535-.494-.852-.516-.279-.021-.861.026-1.129.284-.663.639-.77 2.518.258 4.095 1.517 2.327 4.161 3.242 5.923 2.684 1.168-.37 1.256-1.996.79-2.296-.289-.187-1.355-.724-1.572-.782-.239-.065-.486.136-.61.428-.152.355-.371.603-.645.474-.486-.23-1.637-.961-2.435-1.995-.236-.307-.07-.584.148-.824.162-.178.293-.418.406-.575.099-.138.077-.384-.047-.568-.224-.333-.77-1.684-.897-1.94z" /></svg>
                WhatsApp’tan Yaz
              </a>
            </div>

            <div>
              <div className="text-sm font-semibold text-navy/50 uppercase tracking-wider mb-1">Adres</div>
              <div className="text-lg font-medium text-navy">Tekstilkent, İbrahim Tevfik Kutlar Cd NO:163D, 27100 Şahinbey/Gaziantep</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-navy/50 uppercase tracking-wider mb-1">Çalışma Saatleri</div>
              <div className="text-lg font-medium text-navy">Pazartesi - Cumartesi: 08:00 - 18:30</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8">
          <div className="font-bold text-xl text-navy mb-2">İletişim Formu</div>
          <p className="text-sm text-navy/60 mb-6">
            Bize mesaj bırakın, en kısa sürede dönüş yapalım.
          </p>

          <form className="space-y-4">
            <input className="w-full rounded-xl border border-navy/10 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="Ad Soyad" />
            <input className="w-full rounded-xl border border-navy/10 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" placeholder="Telefon / E-posta" />
            <textarea className="w-full rounded-xl border border-navy/10 bg-white/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all" rows={5} placeholder="Mesajınız" />
            <button
              type="button"
              className="w-full rounded-xl bg-navy text-white px-6 py-4 text-sm font-bold hover:bg-brand transition-colors shadow-lg shadow-navy/20"
              onClick={() => alert("Demo form. Mesajınız alındı!")}
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
