import { cn } from "@/lib/cn";

const tones = {
  paper: "bg-paper",
  white: "bg-white",
  pink: "bg-psst-pink",
  lime: "bg-psst-lime",
  blue: "bg-psst-blue text-paper",
  violet: "bg-psst-violet text-paper",
  amber: "bg-psst-amber",
  mint: "bg-psst-mint",
  ink: "bg-ink text-paper",
};

export default function Card({
  tone = "white",
  interactive = false,
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "border-3 border-ink shadow-brutal",
        tones[tone],
        interactive && "press-lg cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
