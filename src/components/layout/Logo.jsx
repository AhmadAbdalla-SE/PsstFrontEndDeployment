import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export default function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        "press inline-flex items-center border-3 border-ink bg-psst-lime px-3 py-1.5 shadow-brutal",
        className
      )}
    >
      <span className="text-xl font-black tracking-tighter text-ink">psst</span>
      <span className="text-xl font-black text-psst-pink">.</span>
    </Link>
  );
}
