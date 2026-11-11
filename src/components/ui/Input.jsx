import { useId } from "react";
import { cn } from "@/lib/cn";

export default function Input({
  label,
  error,
  hint,
  as = "input",
  className,
  children,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const Tag = as;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-black uppercase tracking-widest"
        >
          {label}
        </label>
      )}

      <Tag
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          "w-full border-3 bg-white px-3 py-2.5 text-base font-semibold placeholder:font-medium placeholder:text-ink/35",
          "shadow-brutal-sm focus:shadow-brutal focus:outline-none",
          "transition-shadow",
          error ? "border-red-600" : "border-ink",
          as === "textarea" && "min-h-28 resize-y",
          className
        )}
        {...props}
      >
        {children}
      </Tag>

      {hint && !error && (
        <p id={hintId} className="text-xs font-medium text-ink/55">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
