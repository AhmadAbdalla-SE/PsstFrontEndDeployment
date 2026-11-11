import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoader from "@/components/ui/PageLoader";
import Landing from "@/pages/landing/Landing";
import NotFound from "@/pages/NotFound";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

const Signup = lazy(() => import("@/pages/auth/Signup"));
const Login = lazy(() => import("@/pages/auth/Login"));
const ConfirmEmail = lazy(() => import("@/pages/auth/ConfirmEmail"));
const ConfirmLogin = lazy(() => import("@/pages/auth/ConfirmLogin"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const SendMessage = lazy(() => import("@/pages/send/SendMessage"));
const Inbox = lazy(() => import("@/pages/inbox/Inbox"));
const MessageDetail = lazy(() => import("@/pages/inbox/MessageDetail"));
const Requests = lazy(() => import("@/pages/requests/Requests"));
const Conversations = lazy(() => import("@/pages/conversations/Conversations"));
const Conversation = lazy(() => import("@/pages/conversations/Conversation"));
const Share = lazy(() => import("@/pages/share/Share"));
const Profile = lazy(() => import("@/pages/profile/Profile"));

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/confirm-login" element={<ConfirmLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/send/:userId" element={<SendMessage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/message/:messageId" element={<MessageDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:conversationId" element={<Conversation />} />
          <Route path="/share" element={<Share />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
