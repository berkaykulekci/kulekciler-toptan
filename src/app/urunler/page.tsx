import FiltersBar from "@/components/FiltersBar";
import ProductGrid from "@/components/ProductGrid";
import { createSupabaseServer } from "@/lib/supabase/server";
import BackButton from "@/components/BackButton";

type SP = { q?: string; cat?: string; sort?: string; page?: string };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const cat = sp.cat?.trim() || "";
  const sort = sp.sort || "new";
  const page = Math.max(parseInt(sp.page || "1", 10), 1);

  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createSupabaseServer();

  // ✅ Dinamik kategoriler
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  let query = supabase
    .from("products")
    .select("id,name,slug,description,category,created_at,product_images(image_url,sort_order)", { count: "exact" })
    .eq("is_active", true);

  if (cat) query = query.eq("category", cat);
  if (q) query = query.ilike("name", `%${q}%`);

  if (sort === "az") query = query.order("name", { ascending: true });
  else query = query.order("created_at", { ascending: false });

  query = query.range(from, to);

  const { data, count } = await query;
  const totalPages = Math.max(Math.ceil((count || 0) / pageSize), 1);

  const qsPrev = new URLSearchParams({ ...sp, page: String(page - 1) }).toString();
  const qsNext = new URLSearchParams({ ...sp, page: String(page + 1) }).toString();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <BackButton />

      <h1 className="text-3xl font-semibold">Ürünler</h1>
      <p className="mt-2 text-slate-600">Kategori seçiniz.</p>

      <div className="mt-6">
        <FiltersBar categories={categories ?? []} />
      </div>

      <div className="mt-6">
        <ProductGrid products={data ?? []} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Sayfa {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <a
            className={`rounded-lg border px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
            href={`/urunler?${qsPrev}`}
          >
            ← Önceki
          </a>
          <a
            className={`rounded-lg border px-3 py-2 text-sm ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
            href={`/urunler?${qsNext}`}
          >
            Sonraki →
          </a>
        </div>
      </div>
    </div>
  );
}
