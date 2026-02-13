"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { slugifyTR } from "@/lib/slug";

type Category = { name: string; slug: string };

export default function AdminNewProduct() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [packageInfo, setPackageInfo] = useState("");
  const [minOrderNote, setMinOrderNote] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSave = useMemo(() => !!name.trim() && !!slug.trim() && !!category.trim(), [name, slug, category]);

  useEffect(() => {
    (async () => {
      setCatsLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("name,slug")
        .order("name", { ascending: true });

      setCatsLoading(false);

      if (error) {
        setErr(error.message);
        return;
      }

      const list = (data ?? []) as any as Category[];
      setCategories(list);

      // default category
      if (!category && list.length > 0) setCategory(list[0].name);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onNameChange(v: string) {
    setName(v);
    setSlug(slugifyTR(v));
  }

  async function createProduct() {
    if (!canSave) return;
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category: category.trim(),
        package_info: packageInfo.trim(),
        min_order_note: minOrderNote.trim(),
        is_featured: isFeatured,
        is_active: isActive,
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) return setErr(error.message);

    router.push(`/admin/urunler/${data.id}`);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Yeni Ürün</h1>
          <p className="mt-1 text-sm text-slate-600">Ürün bilgilerini gir</p>
        </div>
        <button
          onClick={() => router.push("/admin/urunler")}
          className="rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
          type="button"
        >
          Geri
        </button>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Ürün Adı</label>
            <input
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Slug</label>
            <input
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Açıklama</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={catsLoading || categories.length === 0}
            >
              {categories.length === 0 ? (
                <option value="">Kategori yok</option>
              ) : (
                categories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
            <div className="mt-1 text-xs text-slate-500">
              Kategori yoksa <a className="underline" href="/admin/kategoriler">Kategoriler</a> sayfasından ekleyebilirsin.
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Paket / Ölçü</label>
            <input
              className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
              value={packageInfo}
              onChange={(e) => setPackageInfo(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Minimum Sipariş Notu</label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
            value={minOrderNote}
            onChange={(e) => setMinOrderNote(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Öne çıkan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Aktif
          </label>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button
          disabled={loading || !canSave}
          onClick={createProduct}
          className="rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand2 disabled:opacity-60"
          type="button"
        >
          {loading ? "Kaydediliyor..." : "Ürünü Kaydet"}
        </button>

        <div className="text-xs text-slate-500">
          Not: Görselleri ürünü oluşturduktan sonra düzenleme ekranında ekleyebilirsin.
        </div>
      </div>
    </div>
  );
}
