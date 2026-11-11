import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <Badge tone="pink" className="-rotate-2">
        404
      </Badge>
      <h1 className="mt-5 text-6xl font-black tracking-tighter">
        Nothing here.
      </h1>
      <p className="mt-4 text-lg font-medium text-ink/70">
        Whatever you were looking for, nobody whispered it to this address.
      </p>
      <Button to="/" size="lg" variant="primary" className="mt-8">
        Back to safety
      </Button>
    </section>
  );
}
