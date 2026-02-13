import Link from "next/link";

type Img = { image_url: string; sort_order?: number | null };

export default function ProductCard(props: {
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  images?: Img[] | null;
}) {
  const img = (props.images ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]?.image_url;

  return (
    <Link
      href={`/urunler/${props.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/5 border border-navy/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
        {img ? (
          <img
            src={img}
            alt={props.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-navy/40">
            Görsel hazırlanıyor
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy backdrop-blur-sm shadow-sm">
            {props.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-navy transition-colors group-hover:text-brand">
          {props.name}
        </h3>

        {props.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-navy/70">
            {props.description}
          </p>
        )}

        <div className="mt-auto pt-5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">İncele</span>
          <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand transition-all group-hover:bg-brand group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
