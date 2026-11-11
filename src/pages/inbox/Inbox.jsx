import { useCallback, useEffect, useState } from "react";
import { Inbox as InboxIcon, Link2, RefreshCw } from "lucide-react";
import * as messageApi from "@/api/message.api";
import * as requestApi from "@/api/request.api";
import MessageCard from "@/components/message/MessageCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import Tabs from "@/components/ui/Tabs";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useToast } from "@/context/ToastContext";
import { MessageFeed, RequestStatus } from "@/lib/enums";

const TABS = [
  { value: MessageFeed.RECEIVED, label: "Received" },
  { value: MessageFeed.SENT, label: "Sent" },
  { value: MessageFeed.ALL, label: "All" },
];

const LIMIT = 9;

export default function Inbox() {
  const { user } = useAuth();
  const { markSeen } = useNotifications();
  const toast = useToast();

  const [feed, setFeed] = useState(MessageFeed.RECEIVED);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [askingId, setAskingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await messageApi.getMessages({ type: feed, page, limit: LIMIT });
      setData(result);
      if (feed === MessageFeed.RECEIVED) {
        markSeen("messages", result?.count ?? 0);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [feed, page, markSeen]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFeed = (value) => {
    setFeed(value);
    setPage(1);
  };

  const handleAsk = async (message) => {
    setAskingId(message._id);
    try {
      const request = await requestApi.createRevealRequest({ messageId: message._id });

      if (request?.status === RequestStatus.REJECTED) {
        toast.info("That one was sent without an account, so there is nobody to ask.");
      } else {
        toast.success("Asked. Now it is up to them.");
      }

      setData((current) =>
        current && {
          ...current,
          docs: current.docs.map((doc) =>
            doc._id === message._id
              ? { ...doc, revealRequest: { _id: request?._id, status: request?.status } }
              : doc
          ),
        }
      );
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setAskingId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await messageApi.deleteMessage(pendingDelete._id);
      toast.success("Message deleted.");
      setPendingDelete(null);

      if (data?.docs.length === 1 && page > 1) {
        setPage((value) => value - 1);
      } else {
        await load();
      }
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setDeleting(false);
    }
  };

  const docs = data?.docs ?? [];
  const isOutgoing = (message) =>
    feed === MessageFeed.SENT ||
    (feed === MessageFeed.ALL && String(message.senderId) === String(user?._id));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="lime" className="-rotate-2">
            Your inbox
          </Badge>
          <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
            What people said.
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="paper" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={15} /> Refresh
          </Button>
          <Button to="/share" variant="primary" size="sm">
            <Link2 size={15} /> My link
          </Button>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <Tabs options={TABS} value={feed} onChange={changeFeed} disabled={loading} />
        {data?.count > 0 && (
          <span className="text-xs font-black uppercase tracking-widest text-ink/45">
            {data.count} total
          </span>
        )}
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size={32} />
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon={InboxIcon}
            title="Could not load your inbox"
            body={error}
            action={
              <Button variant="primary" onClick={load}>
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && docs.length === 0 && (
          <EmptyState
            icon={InboxIcon}
            title={
              feed === MessageFeed.SENT ? "You have not sent anything" : "Nothing yet"
            }
            body={
              feed === MessageFeed.SENT
                ? "Messages you send through someone's link will show up here."
                : "Share your link and give people somewhere to be honest."
            }
            action={
              <Button to="/share" variant="primary">
                <Link2 size={16} /> Get my link
              </Button>
            }
          />
        )}

        {!loading && !error && docs.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  outgoing={isOutgoing(message)}
                  asking={askingId === message._id}
                  onAsk={() => handleAsk(message)}
                  onDelete={() => setPendingDelete(message)}
                />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                page={data.currentPage}
                pages={data.pages}
                onChange={setPage}
                disabled={loading}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this message?"
        body="It is gone for good, and the sender is never told."
        confirmLabel="Delete it"
        pending={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
