export default function AdminTopStats(props: { total: number; active: number; featured: number }) {
  const items = [
    { label: "Toplam Ürün", value: props.total },
    { label: "Aktif Ürün", value: props.active },
    { label: "Öne Çıkan", value: props.featured },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Genel özet</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl border bg-white p-6">
            <div className="text-sm text-slate-500">{it.label}</div>
            <div className="mt-2 text-3xl font-semibold">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
