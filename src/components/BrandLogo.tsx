import Image from "next/image";
import clsx from "clsx";

export default function BrandLogo({
  variant = "nav",
  size = 44,
  showText = true,
}: {
  variant?: "nav" | "hero";
  size?: number;
  showText?: boolean;
}) {
  const isHero = variant === "hero";
  const imgSize = isHero ? 120 : size;

  return (
    <div className="flex items-center gap-3">
      <div className={clsx("relative overflow-hidden rounded-xl bg-white/5", isHero ? "h-20 w-20 shadow-2xl" : "h-10 w-10 shadow-sm")}>
        <Image
          src="/brand/logo.png"
          alt="Külekçiler Hediyelik"
          width={imgSize}
          height={imgSize}
          className="h-full w-full object-contain"
          priority={isHero}
        />
      </div>

      {showText && (
        <div className={clsx("leading-tight", isHero ? "mt-1" : "")}>
          <div className={clsx("font-semibold text-ink", isHero ? "text-2xl" : "text-sm")}>
            Külekçiler Hediyelik
          </div>
          <div className={clsx("text-ink/70", isHero ? "text-sm" : "text-xs")}>
            Gaziantep • Ürün Kataloğu
          </div>
        </div>
      )}
    </div>
  );
}
