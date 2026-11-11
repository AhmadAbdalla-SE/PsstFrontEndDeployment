import { assetUrl, initialsOf } from "@/lib/assets";
import { cn } from "@/lib/cn";

export default function Avatar({ name, image, size = 36, className }) {
  const source = assetUrl(image);

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border-3 border-ink bg-psst-amber shadow-brutal-sm",
        className
      )}
    >
      {source ? (
        <img
          src={source}
          alt={name ? `${name}'s avatar` : "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          style={{ fontSize: size * 0.38 }}
          className="font-black tracking-tight"
          aria-hidden="true"
        >
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
