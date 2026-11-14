import { useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import Lightbox from "@/components/ui/Lightbox";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/cn";

export default function AttachmentGrid({ attachments = [], className }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!attachments.length) return null;

  const urls = attachments.map((path) => assetUrl(path));
  const single = attachments.length === 1;

  return (
    <>
      <div
        className={cn("grid gap-2", single ? "grid-cols-1" : "grid-cols-3", className)}
      >
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image ${index + 1} of ${urls.length}`}
            className="press block overflow-hidden border-3 border-ink shadow-brutal-sm"
          >
            <AssetImage
              src={url}
              alt=""
              className={cn(
                "w-full object-cover",
                single ? "aspect-[4/3] max-h-72" : "aspect-square h-24"
              )}
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={urls}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
