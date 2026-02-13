"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function ImageUploader(props: {
  productId: string;
  onUploaded: (publicUrl: string) => void;
}) {
  const supabase = createSupabaseBrowser();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);
    setUploading(true);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${props.productId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("products-image")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (upErr) {
      setUploading(false);
      setErr(upErr.message);
      return;
    }

    const { data } = supabase.storage.from("products-image").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    setUploading(false);
    props.onUploaded(publicUrl);

    // aynı dosyayı tekrar seçebilmek için:
    e.target.value = "";
  }

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-sm font-semibold">Dosyadan Görsel Yükle</div>
      <p className="mt-1 text-xs text-slate-600">
        JPG/PNG önerilir. Yükleme sonrası görsel otomatik listeye eklenir.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={onPickFile}
          disabled={uploading}
          className="block w-full text-sm"
        />
      </div>

      {uploading && <div className="mt-2 text-xs text-slate-600">Yükleniyor...</div>}
      {err && <div className="mt-2 text-xs text-red-600">{err}</div>}
    </div>
  );
}
