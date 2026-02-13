import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminProductsList() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("products")
    .select("id,name,category,is_active,is_featured,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ürünler</h1>
          <p className="mt-1 text-sm text-slate-600">Ürün ekle / düzenle / sil</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Öne Çıkan</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">
                  {p.is_active ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Aktif</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">Pasif</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.is_featured ? "Evet" : "Hayır"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-slate-900 hover:underline" href={`/admin/urunler/${p.id}`}>
                    Düzenle →
                  </Link>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr>
                <td className="px-4 py-8 text-slate-500" colSpan={5}>
                  Henüz ürün yok. “Yeni Ürün” ile ekleyebilirsin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
