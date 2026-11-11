import { cn } from "@/lib/cn";

const tones = {
  pink: "bg-psst-pink text-ink",
  lime: "bg-psst-lime text-ink",
  blue: "bg-psst-blue text-paper",
  violet: "bg-psst-violet text-paper",
  amber: "bg-psst-amber text-ink",
  mint: "bg-psst-mint text-ink",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

export default function Badge({ tone = "lime", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-ink px-2 py-0.5 text-[11px] font-black uppercase tracking-widest shadow-brutal-sm",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
