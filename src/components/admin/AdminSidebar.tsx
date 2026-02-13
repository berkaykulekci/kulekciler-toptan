"use client";

import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={[
        "block rounded-xl px-4 py-3 text-sm font-medium",
        active ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="rounded-2xl border bg-white p-4">
      <div className="px-2 pb-3">
        <div className="text-sm font-semibold">Admin Panel</div>
        <div className="mt-2"><BrandLogo size={36} /></div>
      </div>

      <div className="space-y-2">
        <Item href="/admin" label="Dashboard" />
        <Item href="/admin/urunler" label="Ürünler" />
        <Item href="/admin/kategoriler" label="Kategoriler" />
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={logout}
          className="w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
          type="button"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
