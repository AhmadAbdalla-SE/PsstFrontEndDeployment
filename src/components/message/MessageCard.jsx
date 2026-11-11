import { Link } from "react-router-dom";
import {
  Ban,
  Eye,
  Hourglass,
  Maximize2,
  Send,
  Trash2,
  UserX,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { RequestStatus } from "@/lib/enums";
import { exactTime, relativeTime } from "@/lib/date";
import AttachmentGrid from "./AttachmentGrid";

const describeSender = (message) => {
  if (message.sender) {
    return { kind: "revealed", label: message.sender.username };
  }
  if (message.isAnonymous) {
    return { kind: "untraceable", label: "Anonymous" };
  }
  switch (message.revealRequest?.status) {
    case RequestStatus.PENDING:
      return { kind: "pending", label: "Waiting on them" };
    case RequestStatus.REJECTED:
      return { kind: "declined", label: "They said no" };
    default:
      return { kind: "askable", label: "Anonymous" };
  }
};

export default function MessageCard({
  message,
  outgoing = false,
  onAsk,
  onDelete,
  asking = false,
  deleting = false,
}) {
  const sender = describeSender(message);
  const receiver = message.receiverId;

  return (
    <Card tone="white" className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        {outgoing ? (
          <span className="flex items-center gap-2">
            <Avatar
              name={receiver?.firstName ? `${receiver.firstName} ${receiver.lastName}` : undefined}
              image={receiver?.image}
              size={28}
            />
            <span className="text-xs font-black uppercase tracking-widest">
              To {receiver?.firstName ?? "someone"}
            </span>
          </span>
        ) : sender.kind === "revealed" ? (
          <span className="flex items-center gap-2">
            <Avatar name={message.sender.username} image={message.sender.image} size={28} />
            <span className="text-xs font-black uppercase tracking-widest">
              {sender.label}
            </span>
          </span>
        ) : (
          <Badge
            tone={
              sender.kind === "pending"
                ? "amber"
                : sender.kind === "declined" || sender.kind === "untraceable"
                  ? "paper"
                  : "ink"
            }
          >
            {sender.kind === "pending" && <Hourglass size={11} className="mr-1 inline" />}
            {sender.kind === "declined" && <Ban size={11} className="mr-1 inline" />}
            {sender.kind === "untraceable" && <UserX size={11} className="mr-1 inline" />}
            {sender.label}
          </Badge>
        )}

        <time
          dateTime={message.createdAt}
          title={exactTime(message.createdAt)}
          className="shrink-0 text-xs font-bold uppercase tracking-widest text-ink/40"
        >
          {relativeTime(message.createdAt)}
        </time>
      </div>

      {message.content && (
        <p className="mt-4 text-lg leading-snug font-bold break-words whitespace-pre-wrap">
          {message.content}
        </p>
      )}

      <AttachmentGrid attachments={message.attachments} className="mt-4" />

      {sender.kind === "untraceable" && !outgoing && (
        <p className="mt-3 text-xs font-medium text-ink/50">
          Sent without an account, so there is nobody to reveal.
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 border-t-3 border-dashed border-ink/15 pt-4">
        {!outgoing && sender.kind === "askable" && (
          <Button size="sm" variant="lime" onClick={onAsk} disabled={asking}>
            {asking ? <Spinner size={14} /> : <Eye size={14} />}
            Ask who sent this
          </Button>
        )}

        {!outgoing && (
          <Button to={`/message/${message._id}`} size="sm" variant="paper">
            <Maximize2 size={14} /> Open
          </Button>
        )}

        {outgoing ? (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/40">
            <Send size={13} /> Sent
          </span>
        ) : (
          <Button
            size="sm"
            variant="paper"
            onClick={onDelete}
            disabled={deleting}
            className="ml-auto"
            aria-label="Delete message"
          >
            {deleting ? <Spinner size={14} /> : <Trash2 size={14} />}
          </Button>
        )}
      </div>
    </Card>
  );
}
