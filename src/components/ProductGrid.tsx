import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          name={p.name}
          slug={p.slug}
          description={p.description}
          category={p.category}
          images={p.product_images}
        />
      ))}
    </div>
  );
}
