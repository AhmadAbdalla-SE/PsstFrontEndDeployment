import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Send, UserX } from "lucide-react";
import * as messageApi from "@/api/message.api";
import * as userApi from "@/api/user.api";
import ImagePicker from "@/components/message/ImagePicker";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { isObjectId } from "@/lib/validators";

const MAX_CONTENT = 50000;

export default function SendMessage() {
  const { userId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [anonymous, setAnonymous] = useState(true);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const load = useCallback(async () => {
    if (!isObjectId(userId)) {
      setLoadError("That link does not look right.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await userApi.getPublicProfile(userId);
      setRecipient(data?.user ?? null);
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const isSelf = isAuthenticated && String(user?._id) === String(userId);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed && !files.length) {
      setErrors({ content: "Write something, or add an image" });
      return;
    }
    if (trimmed && trimmed.length < 2) {
      setErrors({ content: "That is too short" });
      return;
    }

    setSending(true);
    try {
      await messageApi.sendMessage({
        receiverId: userId,
        content: trimmed || undefined,
        attachments: files,
        anonymous: !isAuthenticated || anonymous,
      });
      setSent(true);
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setContent("");
    setFiles([]);
    setErrors({});
    setSent(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (loadError) {
    return (
      <section className="mx-auto w-full max-w-lg px-4 py-16">
        <EmptyState
          icon={UserX}
          title="Nobody here"
          body={`${loadError} Check the link and try again.`}
          action={
            <Button to="/" variant="primary">
              Go to Psst
            </Button>
          }
        />
      </section>
    );
  }

  if (sent) {
    return (
      <section className="mx-auto w-full max-w-lg px-4 py-16">
        <Card tone="mint" className="p-8 text-center">
          <CheckCircle2 size={40} className="mx-auto" />
          <h1 className="mt-4 text-3xl font-black tracking-tighter">
            Off it goes.
          </h1>
          <p className="mt-3 font-medium text-ink/70">
            {recipient?.username ?? "They"} will see it in their inbox
            {anonymous && isAuthenticated ? " without your name on it" : ""}.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button variant="ink" onClick={reset}>
              Send another
            </Button>
            <Button to={isAuthenticated ? "/inbox" : "/signup"} variant="paper">
              {isAuthenticated ? "My inbox" : "Get my own link"}
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-12">
      <Badge tone="amber" className="-rotate-2">
        Psst…
      </Badge>

      <div className="mt-5 flex items-center gap-3">
        <Avatar name={recipient?.username} image={recipient?.image} size={52} />
        <div>
          <h1 className="text-3xl leading-none font-black tracking-tighter sm:text-4xl">
            {recipient?.username ?? "Someone"}
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest text-ink/45">
            is listening
          </p>
        </div>
      </div>

      {isSelf && (
        <Card tone="amber" className="mt-5 p-4">
          <p className="text-sm font-bold">
            This is your own link — you are about to message yourself.
          </p>
        </Card>
      )}

      <Card tone="white" className="mt-6 p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            as="textarea"
            label="Your message"
            placeholder="Say the thing you would not say to their face."
            maxLength={MAX_CONTENT}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setErrors({});
            }}
            error={errors.content}
            className="min-h-40"
          />

          <ImagePicker files={files} onChange={setFiles} disabled={sending} />

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setAnonymous((value) => !value)}
              className={cn(
                "press flex items-center gap-3 border-3 border-ink p-3 text-left shadow-brutal-sm",
                anonymous ? "bg-ink text-paper" : "bg-psst-lime text-ink"
              )}
            >
              {anonymous ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="flex-1">
                <span className="block text-sm font-black uppercase tracking-widest">
                  {anonymous ? "Sending anonymously" : "Sending as yourself"}
                </span>
                <span className="block text-xs font-medium opacity-75">
                  {anonymous
                    ? "Nothing is stored about you, so this can never be revealed."
                    : "They can ask who sent it, and you get to decide."}
                </span>
              </span>
            </button>
          ) : (
            <p className="border-3 border-dashed border-ink/25 p-3 text-xs font-medium text-ink/60">
              You are not logged in, so this is completely anonymous — there is
              nothing stored to reveal later.{" "}
              <Link to="/login" className="font-bold underline underline-offset-2">
                Log in
              </Link>{" "}
              first if you want them to be able to ask who you are.
            </p>
          )}

          <Button type="submit" size="lg" disabled={sending} className="mt-1 w-full">
            {sending ? <Spinner /> : <Send size={18} />}
            {sending ? "Sending" : "Send it"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
