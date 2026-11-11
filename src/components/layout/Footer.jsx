import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm text-sm font-medium text-paper/70">
            Anonymous messages, with a way out of the anonymity when both sides
            want one.
          </p>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-paper/50">
          Built as a learning project
        </p>
      </div>
    </footer>
  );
}
