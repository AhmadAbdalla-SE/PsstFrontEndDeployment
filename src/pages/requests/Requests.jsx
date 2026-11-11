import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, UserCheck } from "lucide-react";
import * as requestApi from "@/api/request.api";
import RequestCard from "@/components/request/RequestCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import Tabs from "@/components/ui/Tabs";
import { useNotifications } from "@/context/NotificationsContext";
import { useToast } from "@/context/ToastContext";
import { RequestFeed, RequestStatus } from "@/lib/enums";

const TABS = [
  { value: RequestFeed.INCOMING, label: "Waiting on you" },
  { value: RequestFeed.OUTGOING, label: "You asked" },
];

const LIMIT = 9;

export default function Requests() {
  const { markSeen } = useNotifications();
  const toast = useToast();
  const navigate = useNavigate();

  const [feed, setFeed] = useState(RequestFeed.INCOMING);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestApi.getRequests({ type: feed, page, limit: LIMIT });
      setData(result);
      if (feed === RequestFeed.INCOMING) {
        markSeen("requests", result?.count ?? 0);
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

  const decide = async (request, accept) => {
    setBusyId(request._id);
    try {
      if (accept) {
        const conversation = await requestApi.acceptRequest(request._id);
        toast.success("You revealed yourself. A conversation is open now.");
        if (conversation?._id) {
          navigate(`/conversations/${conversation._id}`);
          return;
        }
      } else {
        await requestApi.rejectRequest(request._id);
        toast.info("You stayed anonymous.");
      }

      setData((current) =>
        current && {
          ...current,
          docs: current.docs.map((doc) =>
            doc._id === request._id
              ? {
                  ...doc,
                  status: accept ? RequestStatus.ACCEPTED : RequestStatus.REJECTED,
                }
              : doc
          ),
        }
      );
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setBusyId(null);
    }
  };

  const docs = data?.docs ?? [];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="violet" className="-rotate-2">
            Reveal requests
          </Badge>
          <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
            Who wants to know.
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium text-ink/65">
            Nobody is ever unmasked without saying yes. Declining costs you
            nothing and they are not told why.
          </p>
        </div>

        <Button variant="paper" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={15} /> Refresh
        </Button>
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
            icon={UserCheck}
            title="Could not load your requests"
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
            icon={UserCheck}
            title={
              feed === RequestFeed.INCOMING
                ? "Nobody is asking"
                : "You have not asked anyone"
            }
            body={
              feed === RequestFeed.INCOMING
                ? "When someone you wrote to wants to know it was you, it lands here."
                : "Open a message in your inbox and tap “Ask who sent this”."
            }
            action={
              <Button to="/inbox" variant="primary">
                Go to my inbox
              </Button>
            }
          />
        )}

        {!loading && !error && docs.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  busy={busyId === request._id}
                  onAccept={() => decide(request, true)}
                  onReject={() => decide(request, false)}
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
    </section>
  );
}
