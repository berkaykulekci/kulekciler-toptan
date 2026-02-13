"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { slugifyTR } from "@/lib/slug";
import ImageUploader from "@/components/admin/ImageUploader";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  package_info: string | null;
  min_order_note: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
};

type Img = { id: string; image_url: string; sort_order: number };
type Category = { name: string; slug: string };

export default function AdminEditProduct() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [p, setP] = useState<Product | null>(null);
  const [imgs, setImgs] = useState<Img[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newImgUrl, setNewImgUrl] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshData() {
    setErr(null);

    const { data: catData, error: catErr } = await supabase
      .from("categories")
      .select("name,slug")
      .order("name", { ascending: true });

    if (catErr) setErr(catErr.message);
    setCategories((catData as any) ?? []);

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) return setErr(error.message);
    setP(data as any);

    const { data: imgData } = await supabase
      .from("product_images")
      .select("id,image_url,sort_order")
      .eq("product_id", id)
      .order("sort_order", { ascending: true });

    setImgs((imgData as any) ?? []);
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const categoryOptions = useMemo(() => {
    const list = [...categories];
    if (p?.category) {
      const exists = list.some((c) => c.name === p.category || c.slug === p.category);
      if (!exists) list.unshift({ name: `${p.category} (Silinmiş)`, slug: p.category });
    }
    return list;
  }, [categories, p?.category]);

  function onNameChange(v: string) {
    if (!p) return;
    setP({ ...p, name: v, slug: slugifyTR(v) });
  }

  async function save() {
    if (!p) return;
    setLoading(true);
    setErr(null);

    const { error } = await supabase
      .from("products")
      .update({
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        package_info: p.package_info,
        min_order_note: p.min_order_note,
        stock: p.stock,
        is_featured: p.is_featured,
        is_active: p.is_active,
      })
      .eq("id", id);

    setLoading(false);
    if (error) return setErr(error.message);

    router.refresh();
    alert("Kaydedildi");
  }

  async function remove() {
    if (!confirm("Ürünü silmek istiyor musun?")) return;
    setLoading(true);
    setErr(null);

    const { error } = await supabase.from("products").delete().eq("id", id);

    setLoading(false);
    if (error) return setErr(error.message);

    router.push("/admin/urunler");
    router.refresh();
  }

  async function insertImageRecord(imageUrl: string) {
    const nextOrder = imgs.length ? Math.max(...imgs.map((x) => x.sort_order)) + 1 : 0;

    const { data, error } = await supabase
      .from("product_images")
      .insert({ product_id: id, image_url: imageUrl, sort_order: nextOrder })
      .select("id,image_url,sort_order")
      .single();

    if (error) return setErr(error.message);

    setImgs([...imgs, data as any].sort((a, b) => a.sort_order - b.sort_order));
  }

  async function addImageUrl() {
    const url = newImgUrl.trim();
    if (!url) return;
    await insertImageRecord(url);
    setNewImgUrl("");
  }

  async function deleteImg(imgId: string, imageUrl: string) {
    const { error } = await supabase.from("product_images").delete().eq("id", imgId);
    if (error) return setErr(error.message);

    setImgs(imgs.filter((x) => x.id !== imgId));

    try {
      const marker = "/storage/v1/object/public/products-image/";
      const idx = imageUrl.indexOf(marker);
      if (idx !== -1) {
        const path = imageUrl.substring(idx + marker.length);
        await supabase.storage.from("products-image").remove([path]);
      }
    } catch { }
  }

  async function swapOrder(a: Img, b: Img) {
    setErr(null);
    const aOrder = a.sort_order;
    const bOrder = b.sort_order;

    const { error: e1 } = await supabase.from("product_images").update({ sort_order: bOrder }).eq("id", a.id);
    if (e1) return setErr(e1.message);

    const { error: e2 } = await supabase.from("product_images").update({ sort_order: aOrder }).eq("id", b.id);
    if (e2) return setErr(e2.message);

    const next = imgs
      .map((x) => {
        if (x.id === a.id) return { ...x, sort_order: bOrder };
        if (x.id === b.id) return { ...x, sort_order: aOrder };
        return x;
      })
      .sort((x, y) => x.sort_order - y.sort_order);

    setImgs(next);
    router.refresh();
  }

  async function moveUp(index: number) {
    if (index <= 0) return;
    await swapOrder(imgs[index], imgs[index - 1]);
  }

  async function moveDown(index: number) {
    if (index >= imgs.length - 1) return;
    await swapOrder(imgs[index], imgs[index + 1]);
  }

  if (!p) return <div className="text-sm text-slate-600">Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ürün Düzenle</h1>
          <p className="mt-1 text-sm text-slate-600">ID: {p.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/urunler")}
            className="rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
            type="button"
          >
            Geri
          </button>
          <a className="rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50" href={`/urunler/${p.slug}`} target="_blank">
            Public Gör →
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Ürün Adı</label>
            <input className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" value={p.name} onChange={(e) => onNameChange(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Açıklama</label>
          <textarea className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" rows={4} value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={p.category}
              onChange={(e) => setP({ ...p, category: e.target.value })}
            >
              <option value="">Kategori seç</option>
              {categoryOptions.map((c) => (
                <option key={c.slug + c.name} value={c.slug === p.category ? p.category : c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Paket / Ölçü</label>
            <input className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" value={p.package_info ?? ""} onChange={(e) => setP({ ...p, package_info: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Minimum Sipariş Notu</label>
            <input className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" value={p.min_order_note ?? ""} onChange={(e) => setP({ ...p, min_order_note: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium">Stok Adedi</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={p.stock ?? 0}
              onChange={(e) => setP({ ...p, stock: parseInt(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} />
            Öne çıkan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.is_active} onChange={(e) => setP({ ...p, is_active: e.target.checked })} />
            Aktif
          </label>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4 space-y-4">
          <div className="font-semibold text-sm">Görseller (ilk görsel kapak olur)</div>

          <ImageUploader productId={id} onUploaded={insertImageRecord} />

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm font-semibold">URL ile Görsel Ekle (opsiyonel)</div>
            <div className="mt-3 flex gap-2">
              <input className="w-full rounded-xl border px-4 py-3 text-sm" placeholder="https://..." value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} />
              <button onClick={addImageUrl} className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand2" type="button">
                Ekle
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {imgs.map((im, idx) => (
              <div key={im.id} className="rounded-xl border bg-white p-3">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                  <img src={im.image_url} alt="" className="h-full w-full object-cover" />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">Sıra: {im.sort_order}{idx === 0 ? " • Kapak" : ""}</div>
                  <button onClick={() => deleteImg(im.id, im.image_url)} className="text-xs font-medium text-red-600 hover:underline" type="button">
                    Sil
                  </button>
                </div>

                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-50">
                    ↑ Yukarı
                  </button>
                  <button type="button" onClick={() => moveDown(idx)} disabled={idx === imgs.length - 1} className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-50">
                    ↓ Aşağı
                  </button>
                </div>
              </div>
            ))}
            {imgs.length === 0 && <div className="text-sm text-slate-600">Henüz görsel yok.</div>}
          </div>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="flex flex-wrap gap-3">
          <button disabled={loading} onClick={save} className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand2 disabled:opacity-60" type="button">
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>

          <button disabled={loading} onClick={remove} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60" type="button">
            Ürünü Sil
          </button>
        </div>
      </div>
    </div>
  );
}
