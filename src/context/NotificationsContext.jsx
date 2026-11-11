import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import * as conversationApi from "@/api/conversation.api";
import * as messageApi from "@/api/message.api";
import * as requestApi from "@/api/request.api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { MessageFeed, RequestFeed } from "@/lib/enums";
import {
  baselineSeenCount,
  getSeenAt,
  getSeenCount,
  setSeenAt,
  setSeenCount,
} from "@/lib/seen";

const POLL_MS = 30000;

const NotificationsContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used inside <NotificationsProvider>");
  }
  return context;
};

const EMPTY = { messages: 0, requests: 0, conversations: 0 };

export function NotificationsProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [unread, setUnread] = useState(EMPTY);

  const totals = useRef({ messages: 0, requests: 0 });
  const previous = useRef(null);
  const path = useRef(location.pathname);
  path.current = location.pathname;

  const refresh = useCallback(async () => {
    const [messagePage, requestPage, conversationPage] = await Promise.all([
      messageApi.getMessages({ type: MessageFeed.RECEIVED, page: 1, limit: 1 }),
      requestApi.getRequests({ type: RequestFeed.INCOMING, page: 1, limit: 1 }),
      conversationApi.getConversations({ page: 1, limit: 20 }),
    ]);

    const messageTotal = messagePage?.count ?? 0;
    const requestTotal = requestPage?.count ?? 0;
    totals.current = { messages: messageTotal, requests: requestTotal };

    if (messageTotal < getSeenCount("messages")) {
      setSeenCount("messages", messageTotal);
    }

    const seenConversationsAt = getSeenAt("conversations");
    const conversationCount = (conversationPage?.docs ?? []).filter((thread) => {
      const at = Date.parse(thread.lastMessageAt ?? thread.createdAt ?? 0);
      const mine = String(thread.lastMessageBy ?? "") === String(user?._id ?? "");
      return !mine && at > seenConversationsAt;
    }).length;

    return {
      messages: Math.max(0, messageTotal - baselineSeenCount("messages", messageTotal)),
      requests: Math.max(0, requestTotal - baselineSeenCount("requests", requestTotal)),
      conversations: conversationCount,
    };
  }, [user?._id]);

  const announce = useCallback(
    (next) => {
      const before = previous.current;
      previous.current = next;

      if (!before) return;

      const arrivals = [
        {
          key: "messages",
          grew: next.messages > before.messages,
          at: "/inbox",
          text: "Someone just sent you a message.",
        },
        {
          key: "requests",
          grew: next.requests > before.requests,
          at: "/requests",
          text: "Someone wants to know it was you.",
        },
        {
          key: "conversations",
          grew: next.conversations > before.conversations,
          at: "/conversations",
          text: "You have a new reply.",
        },
      ];

      arrivals.forEach((arrival) => {
        if (arrival.grew && !path.current.startsWith(arrival.at)) {
          toast.info(arrival.text);
        }
      });
    },
    [toast]
  );

  const poll = useCallback(async () => {
    try {
      const next = await refresh();
      setUnread(next);
      announce(next);
    } catch {
    }
  }, [refresh, announce]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnread(EMPTY);
      previous.current = null;
      return undefined;
    }

    poll();

    const tick = () => {
      if (document.visibilityState === "visible") poll();
    };
    const timer = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [isAuthenticated, poll]);

  const markSeen = useCallback((section, total) => {
    if (section === "conversations") {
      setSeenAt("conversations");
    } else {
      setSeenCount(section, total ?? totals.current[section] ?? 0);
    }

    setUnread((current) => ({ ...current, [section]: 0 }));
    if (previous.current) {
      previous.current = { ...previous.current, [section]: 0 };
    }
  }, []);

  const value = useMemo(
    () => ({ unread, markSeen, refresh: poll }),
    [unread, markSeen, poll]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
