"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { slugifyTR } from "@/lib/slug";

type Cat = { id: string; name: string; slug: string; created_at?: string };

export default function AdminCategoriesPage() {
  const supabase = createSupabaseBrowser();

  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const canAdd = useMemo(() => name.trim().length > 0 && slug.trim().length > 0, [name, slug]);

  async function load() {
    setErr(null);
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,created_at")
      .order("name", { ascending: true });

    if (error) return setErr(error.message);
    setCats((data as any) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onNameChange(v: string) {
    setName(v);
    setSlug(slugifyTR(v));
  }

  async function addCategory() {
    if (!canAdd) return;
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug: slug.trim() })
      .select("id,name,slug,created_at")
      .single();

    setLoading(false);

    if (error) return setErr(error.message);

    setCats([...cats, data as any].sort((a, b) => a.name.localeCompare(b.name, "tr")));
    setName("");
    setSlug("");
  }

  async function updateCategory(id: string, patch: Partial<Cat>) {
    setErr(null);
    const { error } = await supabase.from("categories").update(patch).eq("id", id);
    if (error) return setErr(error.message);

    setCats(cats.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function deleteCategory(id: string) {
    if (!confirm("Kategoriyi silmek istiyor musun?")) return;
    setErr(null);

    const target = cats.find((x) => x.id === id);
    if (!target) return;

    // ✅ Kesin kontrol: ürünler kategori alanında bazen name bazen slug tutabiliyor.
    const { count: cName, error: eName } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", target.name);

    if (eName) return setErr(eName.message);

    const { count: cSlug, error: eSlug } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", target.slug);

    if (eSlug) return setErr(eSlug.message);

    const total = (cName || 0) + (cSlug || 0);

    if (total > 0) {
      return setErr(
        `Bu kategoriye bağlı ${total} ürün var. Önce ürünleri başka kategoriye taşı veya ürünlerden kategoriyi kaldır.`
      );
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return setErr(error.message);

    setCats(cats.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Kategoriler</h1>
          <p className="mt-1 text-sm text-slate-600">Kategori ekle / düzenle / sil</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-sm font-semibold">Yeni Kategori</div>


          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Kategori Adı</label>
              <input
                className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Örn: Hırdavat"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Slug</label>
              <input
                className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="örn: hirdavat"
              />
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <button
              onClick={addCategory}
              disabled={!canAdd || loading}
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand2 disabled:opacity-60"
              type="button"
            >
              {loading ? "Ekleniyor..." : "Kategori Ekle"}
            </button>


          </div>
        </div>

        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
            <div className="text-sm font-semibold">Mevcut Kategoriler</div>
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-white"
              onClick={load}
            >
              Yenile
            </button>
          </div>

          <div className="divide-y">
            {cats.map((c) => (
              <CategoryRow key={c.id} cat={c} onSave={updateCategory} onDelete={deleteCategory} />
            ))}

            {cats.length === 0 && (
              <div className="px-4 py-8 text-sm text-slate-600">Henüz kategori yok.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow(props: {
  cat: Cat;
  onSave: (id: string, patch: Partial<Cat>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(props.cat.name);
  const [slug, setSlug] = useState(props.cat.slug);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setName(props.cat.name);
    setSlug(props.cat.slug);
  }, [props.cat.name, props.cat.slug]);

  async function save() {
    await props.onSave(props.cat.id, { name: name.trim(), slug: slug.trim() });
    setEditing(false);
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 grid gap-2 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">Ad</div>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-slate-50"
              value={name}
              disabled={!editing}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs text-slate-500">Slug</div>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm disabled:bg-slate-50"
              value={slug}
              disabled={!editing}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!editing ? (
            <button
              type="button"
              className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-slate-50"
              onClick={() => setEditing(true)}
            >
              Düzenle
            </button>
          ) : (
            <button
              type="button"
              className="rounded-xl bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand2"
              onClick={save}
            >
              Kaydet
            </button>
          )}

          <button
            type="button"
            className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => props.onDelete(props.cat.id)}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
