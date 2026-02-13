"use client";

import { useState } from "react";

export default function Gallery({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  const has = images && images.length > 0;

  const current = has ? images[Math.min(i, images.length - 1)] : null;

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-slate-100">
        {current ? (
          <img src={current} alt="Ürün görseli" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Görsel yok
          </div>
        )}
      </div>

      {has && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((url, idx) => (
            <button
              key={url + idx}
              onClick={() => setI(idx)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${idx === i ? "border-slate-900" : "border-slate-200"}`}
              title={`Görsel ${idx + 1}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
