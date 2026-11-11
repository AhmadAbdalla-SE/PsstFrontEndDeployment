import {
  Eye,
  Handshake,
  Image as ImageIcon,
  Link2,
  Lock,
  MessageSquareDashed,
  Send,
  ShieldCheck,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const steps = [
  {
    n: "01",
    tone: "pink",
    title: "Share your link",
    body: "Every account gets one link. Put it in a bio, a story, a group chat — wherever the people you want to hear from already are.",
    icon: Link2,
  },
  {
    n: "02",
    tone: "amber",
    title: "Collect what people really think",
    body: "Anyone can write to you without an account. No name, no trace, up to three images if words are not enough.",
    icon: MessageSquareDashed,
  },
  {
    n: "03",
    tone: "mint",
    title: "Ask who it was",
    body: "One tap sends a reveal request. If they accept, the mask comes off and a private thread opens between the two of you.",
    icon: Handshake,
  },
];

const features = [
  {
    title: "Anonymous by default",
    body: "Messages sent while logged out carry no sender at all. There is nothing stored to reveal later, and we say so plainly on the card.",
    icon: Lock,
    tone: "violet",
  },
  {
    title: "Consent, not exposure",
    body: "Nobody is unmasked behind their back. A reveal only happens when the sender taps accept, and they can decline without a word.",
    icon: ShieldCheck,
    tone: "lime",
  },
  {
    title: "Pictures welcome",
    body: "Attach up to three images to any message or reply. Screenshots, memes, receipts — whatever the message needs.",
    icon: ImageIcon,
    tone: "blue",
  },
  {
    title: "It becomes a conversation",
    body: "An accepted reveal is not the end. It opens a real thread, so the anonymous note turns into an actual talk.",
    icon: Send,
    tone: "pink",
  },
];

export default function Landing() {
  return (
    <>
      <section className="border-b-3 border-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Badge tone="amber" className="-rotate-2">
              👀 Say it without saying who
            </Badge>

            <h1 className="mt-5 text-5xl leading-[0.95] font-black tracking-tighter sm:text-6xl lg:text-7xl">
              heyy,
              <br />
              <span className="bg-psst-pink px-2 text-paper">psst</span>{" "}
              <span className="text-psst-violet">👋</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium text-ink/80">
              Psst gives you one link. People drop you anonymous messages through
              it. When something lands, you can ask who sent it — and if they say
              yes, you keep talking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/signup" size="lg" variant="primary">
                Get my link
              </Button>
              <Button to="/login" size="lg" variant="paper">
                I already have one
              </Button>
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink/50">
              Free · No app to install
            </p>
          </div>

          <div className="relative pb-16 sm:pb-20">
            <Card tone="white" className="rotate-1 p-5">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="ink">Anonymous</Badge>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/40">
                  2 min ago
                </span>
              </div>

              <p className="mt-4 text-xl leading-snug font-bold">
                “you explained that whole recursion thing better than the
                lecturer did. just so you know.”
              </p>

              <div className="mt-5 flex flex-wrap gap-2 border-t-3 border-dashed border-ink/20 pt-4">
                <Button size="sm" variant="lime">
                  <Eye size={14} /> Ask who sent this
                </Button>
                <Button size="sm" variant="paper">
                  Keep it a mystery
                </Button>
              </div>
            </Card>

            <Card
              tone="violet"
              className="absolute bottom-0 -left-3 hidden -rotate-3 p-4 sm:block"
            >
              <p className="text-sm font-black uppercase tracking-wide">
                They accepted 🎉
              </p>
              <p className="text-sm font-medium text-paper/80">
                Conversation opened
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-b-3 border-ink bg-paper-dim">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Badge tone="pink" className="rotate-1">
            How it works
          </Badge>
          <h2 className="mt-4 max-w-2xl text-4xl leading-tight font-black tracking-tight sm:text-5xl">
            Three steps, and one of them is optional.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.n} tone={step.tone} className="flex flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black tracking-tighter opacity-30">
                      {step.n}
                    </span>
                    <span className="border-3 border-ink bg-paper p-2 shadow-brutal-sm">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-medium text-ink/80">
                    {step.body}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-20 border-b-3 border-ink">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="blue" className="-rotate-1">
                Why Psst
              </Badge>
              <h2 className="mt-4 max-w-2xl text-4xl leading-tight font-black tracking-tight sm:text-5xl">
                Anonymous, but not a free-for-all.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} tone="white" className="p-6">
                  <span
                    className={`inline-flex border-3 border-ink p-2 shadow-brutal-sm ${
                      feature.tone === "violet"
                        ? "bg-psst-violet text-paper"
                        : feature.tone === "blue"
                          ? "bg-psst-blue text-paper"
                          : feature.tone === "lime"
                            ? "bg-psst-lime"
                            : "bg-psst-pink"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-xl font-black tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed font-medium text-ink/75">
                    {feature.body}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-psst-lime">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-4xl leading-tight font-black tracking-tighter sm:text-6xl">
            What would people tell you
            <br />
            if nobody knew it was them?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-ink/70">
            One link is all it takes to find out.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/signup" size="lg" variant="ink">
              Create my Psst link
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
