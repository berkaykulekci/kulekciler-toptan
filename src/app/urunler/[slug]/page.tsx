import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { SITE, whatsappPriceLink } from "@/lib/config";
import { createSupabaseServer } from "@/lib/supabase/server";
import BackButton from "@/components/BackButton";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: product } = await supabase
    .from("products")
    .select("id,name,slug,description,category,package_info,min_order_note,product_images(image_url,sort_order)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) return notFound();

  const images = (product.product_images ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((x: any) => x.image_url);

  const { data: similar } = await supabase
    .from("products")
    .select("id,name,slug,description,category,created_at,product_images(image_url,sort_order)")
    .eq("is_active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <BackButton />

      <div className="grid gap-10 md:grid-cols-2">
        <Gallery images={images} />

        <div>
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {product.category}
          </div>
          <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
          {product.description && <p className="mt-4 text-slate-700">{product.description}</p>}

          <div className="mt-6 space-y-3 rounded-2xl border bg-white p-5">
            {product.package_info && (
              <div>
                <div className="text-sm font-medium">Paket / Ölçü</div>
                <div className="text-sm text-slate-600">{product.package_info}</div>
              </div>
            )}
            {product.min_order_note && (
              <div>
                <div className="text-sm font-medium">Minimum Sipariş</div>
                <div className="text-sm text-slate-600">{product.min_order_note}</div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappPriceLink(product.name)}
              target="_blank"
              className="rounded-xl bg-brand px-5 py-3 font-medium text-white hover:bg-brand2"
            >
              WhatsApp ile fiyat sor
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-900 hover:bg-slate-50"
            >
              Arayın
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold">Benzer Ürünler</h2>
        <p className="mt-1 text-slate-600 text-sm">Aynı kategoriden diğer seçenekler.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(similar ?? []).map((p: any) => (
            <a key={p.id} href={`/urunler/${p.slug}`} className="rounded-2xl border bg-white p-4 hover:shadow-sm">
              <div className="text-sm text-slate-500">{p.category}</div>
              <div className="mt-1 font-medium">{p.name}</div>
              <div className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
