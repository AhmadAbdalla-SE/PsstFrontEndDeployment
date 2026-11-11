import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessagesSquare, RefreshCw } from "lucide-react";
import * as conversationApi from "@/api/conversation.api";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { relativeTime } from "@/lib/date";
import { displayName, otherParticipant } from "@/lib/participants";

const LIMIT = 10;

export default function Conversations() {
  const { user } = useAuth();
  const { markSeen } = useNotifications();

  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await conversationApi.getConversations({ page, limit: LIMIT }));
      markSeen("conversations");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [page, markSeen]);

  useEffect(() => {
    load();
  }, [load]);

  const docs = data?.docs ?? [];

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="mint" className="-rotate-2">
            Conversations
          </Badge>
          <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
            Masks off.
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium text-ink/65">
            Every thread here started as an anonymous message that someone chose
            to put their name to.
          </p>
        </div>

        <Button variant="paper" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={15} /> Refresh
        </Button>
      </div>

      <div className="mt-7">
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size={32} />
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon={MessagesSquare}
            title="Could not load your conversations"
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
            icon={MessagesSquare}
            title="No conversations yet"
            body="When you ask who sent a message and they accept, the thread opens here."
            action={
              <Button to="/inbox" variant="primary">
                Go to my inbox
              </Button>
            }
          />
        )}

        {!loading && !error && docs.length > 0 && (
          <>
            <ul className="flex flex-col gap-3">
              {docs.map((conversation) => {
                const other = otherParticipant(conversation, user?._id);
                const starter = conversation.messageId;

                return (
                  <li key={conversation._id}>
                    <Link to={`/conversations/${conversation._id}`} className="block">
                      <Card tone="white" interactive className="flex items-center gap-4 p-4">
                        <Avatar
                          name={displayName(other)}
                          image={other?.image}
                          size={46}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-black tracking-tight">
                            {displayName(other)}
                          </p>
                          {starter?.content && (
                            <p className="truncate text-sm font-medium text-ink/55">
                              Started from: “{starter.content}”
                            </p>
                          )}
                        </div>

                        <time
                          dateTime={conversation.createdAt}
                          className="shrink-0 text-xs font-bold uppercase tracking-widest text-ink/40"
                        >
                          {relativeTime(conversation.createdAt)}
                        </time>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>

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
    </section>
  );
}
