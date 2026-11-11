import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const base =
  "press inline-flex items-center justify-center gap-2 border-3 border-ink font-extrabold uppercase tracking-wide shadow-brutal disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-psst-pink text-ink",
  lime: "bg-psst-lime text-ink",
  blue: "bg-psst-blue text-paper",
  violet: "bg-psst-violet text-paper",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
  danger: "bg-red-500 text-paper",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  const Tag = as ?? "button";
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
