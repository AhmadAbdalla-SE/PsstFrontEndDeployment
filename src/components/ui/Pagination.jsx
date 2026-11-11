import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

export default function Pagination({ page, pages, onChange, disabled }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 pt-2"
    >
      <Button
        variant="paper"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} /> Prev
      </Button>

      <span className="text-xs font-black uppercase tracking-widest">
        {page} / {pages}
      </span>

      <Button
        variant="paper"
        size="sm"
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        Next <ChevronRight size={16} />
      </Button>
    </nav>
  );
}
