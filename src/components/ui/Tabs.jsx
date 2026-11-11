import { cn } from "@/lib/cn";

export default function Tabs({ options, value, onChange, disabled }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "press border-3 border-ink px-4 py-2 text-xs font-black uppercase tracking-widest shadow-brutal-sm",
              active ? "bg-psst-pink text-ink" : "bg-white text-ink/70"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
