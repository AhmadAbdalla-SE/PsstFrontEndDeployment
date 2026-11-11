import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ban, Eye, Hourglass, MailX, Trash2, UserX } from "lucide-react";
import * as messageApi from "@/api/message.api";
import * as requestApi from "@/api/request.api";
import AttachmentGrid from "@/components/message/AttachmentGrid";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import { exactTime, relativeTime } from "@/lib/date";
import { RequestStatus } from "@/lib/enums";

export default function MessageDetail() {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asking, setAsking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMessage(await messageApi.getMessage(messageId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAsk = async () => {
    setAsking(true);
    try {
      const request = await requestApi.createRevealRequest({ messageId });
      if (request?.status === RequestStatus.REJECTED) {
        toast.info("Sent without an account, so there is nobody to ask.");
      } else {
        toast.success("Asked. Now it is up to them.");
      }
      await load();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setAsking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await messageApi.deleteMessage(messageId);
      toast.success("Message deleted.");
      navigate("/inbox", { replace: true });
    } catch (requestError) {
      toast.error(requestError.message);
      setDeleting(false);
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
          icon={MailX}
          title="Message not found"
          body={`${error}. You can only open messages you received.`}
          action={
            <Button to="/inbox" variant="primary">
              <ArrowLeft size={16} /> Back to inbox
            </Button>
          }
        />
      </section>
    );
  }

  const revealed = message.sender;
  const status = message.revealRequest?.status;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <Button to="/inbox" variant="paper" size="sm">
        <ArrowLeft size={15} /> Back to inbox
      </Button>

      <Card tone="white" className="mt-5 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {revealed ? (
            <span className="flex items-center gap-2.5">
              <Avatar name={revealed.username} image={revealed.image} size={40} />
              <span>
                <span className="block text-base font-black">{revealed.username}</span>
                <span className="block text-xs font-bold uppercase tracking-widest text-ink/45">
                  Revealed
                </span>
              </span>
            </span>
          ) : message.isAnonymous ? (
            <Badge tone="paper">
              <UserX size={11} className="mr-1 inline" /> Anonymous
            </Badge>
          ) : status === RequestStatus.PENDING ? (
            <Badge tone="amber">
              <Hourglass size={11} className="mr-1 inline" /> Waiting on them
            </Badge>
          ) : status === RequestStatus.REJECTED ? (
            <Badge tone="paper">
              <Ban size={11} className="mr-1 inline" /> They said no
            </Badge>
          ) : (
            <Badge tone="ink">Anonymous</Badge>
          )}

          <time
            dateTime={message.createdAt}
            className="text-xs font-bold uppercase tracking-widest text-ink/40"
            title={exactTime(message.createdAt)}
          >
            {relativeTime(message.createdAt)}
          </time>
        </div>

        {message.content && (
          <p className="mt-6 text-2xl leading-snug font-bold break-words whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        <AttachmentGrid attachments={message.attachments} className="mt-6" />

        {message.isAnonymous && (
          <p className="mt-5 text-sm font-medium text-ink/55">
            This was sent without an account. Nothing about the sender was
            stored, so there is nobody to reveal.
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-2 border-t-3 border-dashed border-ink/15 pt-5">
          {!message.isAnonymous && !message.revealRequest && (
            <Button variant="lime" onClick={handleAsk} disabled={asking}>
              {asking ? <Spinner size={16} /> : <Eye size={16} />}
              Ask who sent this
            </Button>
          )}

          <Button
            variant="paper"
            onClick={() => setConfirmOpen(true)}
            className="ml-auto"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this message?"
        body="It is gone for good, and the sender is never told."
        confirmLabel="Delete it"
        pending={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
