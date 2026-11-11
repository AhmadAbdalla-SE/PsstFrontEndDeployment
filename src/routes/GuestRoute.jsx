import { Navigate, Outlet } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/inbox" replace />;
  }

  return <Outlet />;
}
