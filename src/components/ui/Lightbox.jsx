import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import AssetImage from "@/components/ui/AssetImage";
import { cn } from "@/lib/cn";

export default function Lightbox({ images = [], index, onClose, onIndexChange }) {
  const open = index !== null && index !== undefined && images.length > 0;
  const closeButton = useRef(null);
  const previouslyFocused = useRef(null);

  const step = useCallback(
    (by) => {
      if (images.length < 2) return;
      const next = (index + by + images.length) % images.length;
      onIndexChange(next);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    closeButton.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (document.activeElement === document.body) {
        previouslyFocused.current?.focus?.();
      }
    };
  }, [open, onClose, step]);

  if (!open) return null;

  const source = images[index];
  const many = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close image"
        onClick={onClose}
        className="absolute inset-0 bg-ink/85"
      />

      <div className="absolute top-0 right-0 left-0 flex items-center justify-between gap-2 p-4">
        <span className="border-3 border-ink bg-paper px-2 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
          {many ? `${index + 1} / ${images.length}` : "Image"}
        </span>

        <span className="flex gap-2">
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the original in a new tab"
            className="press border-3 border-ink bg-paper p-1.5 shadow-brutal-sm"
          >
            <ExternalLink size={18} />
          </a>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close image"
            className="press border-3 border-ink bg-psst-pink p-1.5 shadow-brutal-sm"
          >
            <X size={18} />
          </button>
        </span>
      </div>

      {many && (
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous image"
          className="press absolute left-3 z-10 border-3 border-ink bg-paper p-2 shadow-brutal"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <AssetImage
        src={source}
        alt={`Attachment ${index + 1}`}
        loading="eager"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative max-h-[82vh] max-w-full border-3 border-ink bg-paper object-contain shadow-brutal-lg",
          many && "px-0"
        )}
      />

      {many && (
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next image"
          className="press absolute right-3 z-10 border-3 border-ink bg-paper p-2 shadow-brutal"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
