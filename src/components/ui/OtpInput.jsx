import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

export default function OtpInput({ value = "", onChange, error, disabled }) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] ?? "");

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
  };

  const fillFrom = (index, raw) => {
    let chars = raw.replace(/\D/g, "");
    let cursor = index;

    if (chars.length > 1 && chars[0] === digits[index]) {
      chars = chars.slice(1);
      cursor = index + 1;
    }

    if (!chars) {
      setDigit(index, "");
      return;
    }

    const next = [...digits];
    for (const char of chars) {
      if (cursor >= LENGTH) break;
      next[cursor] = char;
      cursor += 1;
    }

    onChange(next.join(""));
    refs.current[Math.min(cursor, LENGTH - 1)]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index, event) => {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.replace(/\D/g, "")) return;
    event.preventDefault();
    fillFrom(index, pasted);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-black uppercase tracking-widest">
        Your 6 digit code
      </span>

      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              refs.current[index] = element;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            value={digit}
            onChange={(event) => fillFrom(index, event.target.value)}
            onPaste={(event) => handlePaste(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              "h-14 w-full max-w-14 border-3 bg-white text-center text-2xl font-black",
              "shadow-brutal-sm focus:shadow-brutal focus:outline-none",
              error ? "border-red-600" : "border-ink"
            )}
          />
        ))}
      </div>

      {error && <p className="text-xs font-bold text-red-700">{error}</p>}
    </div>
  );
}
