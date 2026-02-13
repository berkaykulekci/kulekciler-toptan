import type { Metadata } from "next";
import { SITE } from "./config";

export function baseMetadata(opts?: { title?: string; description?: string }): Metadata {
  const title = opts?.title ? `${opts.title} | ${SITE.name}` : `${SITE.name} | Toptan Ürün Kataloğu`;
  const description =
    opts?.description ??
    "Gaziantep’te güvenilir toptan tedarik. Ürün kataloğunu inceleyin ve hızlı iletişime geçin.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}
