import { Ban, Check, Eye, Hourglass, X } from "lucide-react";
import AttachmentGrid from "@/components/message/AttachmentGrid";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { exactTime, relativeTime } from "@/lib/date";
import { RequestStatus } from "@/lib/enums";

const statusBadge = {
  [RequestStatus.PENDING]: { tone: "amber", icon: Hourglass, label: "Waiting" },
  [RequestStatus.ACCEPTED]: { tone: "mint", icon: Check, label: "Revealed" },
  [RequestStatus.REJECTED]: { tone: "paper", icon: Ban, label: "Declined" },
};

export default function RequestCard({ request, onAccept, onReject, busy }) {
  const message = request.messageId;
  const asker = request.receiverId;
  const badge = statusBadge[request.status] ?? statusBadge[RequestStatus.PENDING];
  const BadgeIcon = badge.icon;

  const decidable = request.isMine && request.status === RequestStatus.PENDING;

  return (
    <Card tone="white" className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={badge.tone}>
          <BadgeIcon size={11} className="mr-1 inline" />
          {badge.label}
        </Badge>

        <time
          dateTime={request.createdAt}
          title={exactTime(request.createdAt)}
          className="shrink-0 text-xs font-bold uppercase tracking-widest text-ink/40"
        >
          {relativeTime(request.createdAt)}
        </time>
      </div>

      {request.isMine ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-bold">
          <Avatar
            name={asker ? `${asker.firstName} ${asker.lastName}` : undefined}
            image={asker?.image}
            size={26}
          />
          {asker?.firstName ?? "Someone"} wants to know you sent this
        </p>
      ) : request.revealedSender ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-bold">
          <Avatar
            name={request.revealedSender.username}
            image={request.revealedSender.image}
            size={26}
          />
          It was {request.revealedSender.username}
        </p>
      ) : (
        <p className="mt-4 text-sm font-bold text-ink/60">
          {request.status === RequestStatus.PENDING
            ? "You asked who sent this"
            : "They chose to stay anonymous"}
        </p>
      )}

      <blockquote className="mt-4 border-l-4 border-ink/20 pl-3">
        {message?.content && (
          <p className="text-base leading-snug font-bold break-words whitespace-pre-wrap">
            {message.content}
          </p>
        )}
        <AttachmentGrid attachments={message?.attachments} className="mt-3" />
      </blockquote>

      {decidable && (
        <div className="mt-auto flex flex-wrap gap-2 border-t-3 border-dashed border-ink/15 pt-4">
          <Button size="sm" variant="lime" onClick={onAccept} disabled={busy}>
            {busy ? <Spinner size={14} /> : <Eye size={14} />}
            Reveal myself
          </Button>
          <Button size="sm" variant="paper" onClick={onReject} disabled={busy}>
            <X size={14} /> Stay hidden
          </Button>
        </div>
      )}
    </Card>
  );
}
