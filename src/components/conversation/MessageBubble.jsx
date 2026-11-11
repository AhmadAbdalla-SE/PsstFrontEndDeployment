import AttachmentGrid from "@/components/message/AttachmentGrid";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { exactTime, relativeTime } from "@/lib/date";
import { displayName } from "@/lib/participants";

export default function MessageBubble({ message, mine }) {
  const sender = message.senderId;

  return (
    <div className={cn("flex gap-2", mine ? "flex-row-reverse" : "flex-row")}>
      <Avatar
        name={displayName(sender)}
        image={sender?.image}
        size={32}
        className="mt-1"
      />

      <div className={cn("flex max-w-[75%] flex-col", mine && "items-end")}>
        <div
          className={cn(
            "border-3 border-ink p-3 shadow-brutal-sm",
            mine ? "bg-psst-lime" : "bg-white"
          )}
        >
          {message.content && (
            <p className="text-base leading-snug font-bold break-words whitespace-pre-wrap">
              {message.content}
            </p>
          )}
          <AttachmentGrid
            attachments={message.attachments}
            className={message.content ? "mt-3" : undefined}
          />
        </div>

        <time
          dateTime={message.createdAt}
          title={exactTime(message.createdAt)}
          className="mt-1 px-1 text-[11px] font-bold uppercase tracking-widest text-ink/40"
        >
          {relativeTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
