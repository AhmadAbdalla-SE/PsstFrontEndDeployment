import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, MessagesSquare } from "lucide-react";
import * as conversationApi from "@/api/conversation.api";
import Composer from "@/components/conversation/Composer";
import MessageBubble from "@/components/conversation/MessageBubble";
import AttachmentGrid from "@/components/message/AttachmentGrid";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useToast } from "@/context/ToastContext";
import { exactTime } from "@/lib/date";
import { displayName, otherParticipant } from "@/lib/participants";

const POLL_MS = 15000;

export default function Conversation() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { markSeen } = useNotifications();
  const toast = useToast();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const bottom = useRef(null);
  const messageCount = useRef(0);

  const loadMessages = useCallback(async () => {
    const list = await conversationApi.getConversationMessages(conversationId);
    setMessages(Array.isArray(list) ? list : []);
    markSeen("conversations");
  }, [conversationId, markSeen]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [details, list] = await Promise.all([
          conversationApi.getConversation(conversationId),
          conversationApi.getConversationMessages(conversationId),
        ]);
        if (cancelled) return;
        setConversation(details);
        setMessages(Array.isArray(list) ? list : []);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (loading || error) return undefined;

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      loadMessages().catch(() => {
      });
    };

    const timer = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [loading, error, loadMessages]);

  useEffect(() => {
    if (messages.length > messageCount.current) {
      bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    messageCount.current = messages.length;
  }, [messages]);

  const handleSend = async ({ content, attachments }) => {
    setSending(true);
    try {
      await conversationApi.sendConversationMessage({
        conversationId,
        content,
        attachments,
      });
      await loadMessages();
      return true;
    } catch (requestError) {
      toast.error(requestError.message);
      return false;
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16">
        <EmptyState
          icon={MessagesSquare}
          title="Conversation not found"
          body={`${error}. You can only open threads you are part of.`}
          action={
            <Button to="/conversations" variant="primary">
              <ArrowLeft size={16} /> All conversations
            </Button>
          }
        />
      </section>
    );
  }

  const other = otherParticipant(conversation, user?._id);
  const starter = conversation?.messageId;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8">
      <Button to="/conversations" variant="paper" size="sm">
        <ArrowLeft size={15} /> All conversations
      </Button>

      <Card tone="white" className="mt-4 flex flex-col overflow-hidden p-0">
        <header className="flex items-center gap-3 border-b-3 border-ink bg-paper p-4">
          <Avatar name={displayName(other)} image={other?.image} size={44} />
          <div className="min-w-0">
            <p className="truncate text-xl font-black tracking-tight">
              {displayName(other)}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/45">
              Talking since {exactTime(conversation?.createdAt)}
            </p>
          </div>
        </header>

        {starter && (
          <div className="border-b-3 border-dashed border-ink/20 bg-paper-dim p-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-ink/45">
              It started with this
            </p>
            {starter.content && (
              <p className="mt-1.5 text-sm font-bold break-words whitespace-pre-wrap">
                “{starter.content}”
              </p>
            )}
            <AttachmentGrid attachments={starter.attachments} className="mt-3" />
          </div>
        )}

        <div className="flex max-h-[55vh] min-h-56 flex-col gap-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="my-auto text-center text-sm font-medium text-ink/50">
              No replies yet. Say the first thing.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                mine={String(message.senderId?._id ?? message.senderId) === String(user?._id)}
              />
            ))
          )}
          <div ref={bottom} />
        </div>

        <Composer onSend={handleSend} sending={sending} />
      </Card>
    </section>
  );
}
