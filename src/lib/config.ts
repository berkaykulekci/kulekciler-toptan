export const SITE = {
  name: "Külekçiler Toptan",
  city: "Gaziantep",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  address: process.env.NEXT_PUBLIC_ADDRESS || "",
};

export function whatsappPriceLink(productName: string) {
  const msg = encodeURIComponent(
    `Merhaba, "${productName}" ürünü için toptan fiyat bilgisi alabilir miyim?`
  );
  const num = SITE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${msg}`;
}
