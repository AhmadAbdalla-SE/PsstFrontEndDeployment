import { useState } from "react";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const steps = [
  "Put it in your Instagram or TikTok bio.",
  "Drop it in a group chat and see who bites.",
  "Add it to your email signature at work. Brave.",
];

export default function Share() {
  const { user } = useAuth();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return <PageLoader />;
  }

  const link = `${window.location.origin}/send/${user._id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the link and copy it manually.");
    }
  };

  const share = async () => {
    try {
      await navigator.share({
        title: "Psst",
        text: "Tell me something, anonymously.",
        url: link,
      });
    } catch {
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12">
      <Badge tone="violet" className="-rotate-2">
        Your link
      </Badge>

      <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
        One link. That's the whole trick.
      </h1>
      <p className="mt-3 text-base font-medium text-ink/70">
        Anyone who opens it can write to you without an account, and without
        leaving a name.
      </p>

      <Card tone="white" className="mt-7 p-6">
        <label
          htmlFor="psst-link"
          className="text-xs font-black uppercase tracking-widest"
        >
          Share this
        </label>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="psst-link"
            readOnly
            value={link}
            onFocus={(event) => event.target.select()}
            className="w-full border-3 border-ink bg-paper-dim px-3 py-2.5 text-sm font-bold shadow-brutal-sm focus:outline-none"
          />

          <div className="flex gap-2">
            <Button onClick={copy} variant={copied ? "lime" : "primary"}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </Button>

            {typeof navigator !== "undefined" && navigator.share && (
              <Button onClick={share} variant="paper" aria-label="Share link">
                <Share2 size={16} />
              </Button>
            )}
          </div>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
        >
          <ExternalLink size={15} /> See what people see
        </a>
      </Card>

      <Card tone="lime" className="mt-6 p-6">
        <h2 className="text-xl font-black tracking-tight">Where to put it</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm font-bold">
              <span className="shrink-0 border-2 border-ink bg-paper px-1.5">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
