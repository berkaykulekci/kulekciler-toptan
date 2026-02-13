"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = { name: string; slug: string };

export default function FiltersBar({ categories }: { categories: Category[] }) {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(sp.get("cat") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "new");

  const url = useMemo(() => {
    const p = new URLSearchParams(sp.toString());
    if (q) p.set("q", q);
    else p.delete("q");

    if (cat) p.set("cat", cat);
    else p.delete("cat");

    if (sort) p.set("sort", sort);
    else p.delete("sort");

    p.delete("page");
    return `/urunler?${p.toString()}`;
  }, [q, cat, sort, sp]);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="w-full rounded-xl border px-4 py-3 text-sm"
          placeholder="Ürün ara"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="w-full rounded-xl border px-4 py-3 text-sm"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border px-4 py-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">En Yeni</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => router.push(url)}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand2"
          type="button"
        >
          Uygula
        </button>

        <button
          onClick={() => router.push("/urunler")}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          type="button"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
