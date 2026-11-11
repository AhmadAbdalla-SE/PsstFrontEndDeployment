import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="mx-auto w-full max-w-lg px-4 py-12 md:py-16">
      {eyebrow && (
        <Badge tone="amber" className="-rotate-2">
          {eyebrow}
        </Badge>
      )}

      <h1 className="mt-4 text-4xl leading-none font-black tracking-tighter sm:text-5xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-base font-medium text-ink/70">{subtitle}</p>
      )}

      <Card tone="white" className="mt-7 p-6 sm:p-7">
        {children}
      </Card>

      {footer && (
        <p className="mt-5 text-center text-sm font-bold">{footer}</p>
      )}
    </section>
  );
}
