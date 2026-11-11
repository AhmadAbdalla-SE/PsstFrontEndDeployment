import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, MonitorSmartphone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { LogoutAction } from "@/lib/enums";

export default function SessionsCard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [confirmAll, setConfirmAll] = useState(false);
  const [busy, setBusy] = useState(false);

  const end = async (action) => {
    setBusy(true);
    try {
      await logout(action);
      toast.info(
        action === LogoutAction.ALL_DEVICES
          ? "Signed out everywhere."
          : "Logged out."
      );
      navigate("/", { replace: true });
    } finally {
      setBusy(false);
      setConfirmAll(false);
    }
  };

  return (
    <>
      <Card tone="white" className="p-6">
        <h2 className="text-xl font-black tracking-tight">Where you are logged in</h2>
        <p className="mt-1 max-w-md text-sm font-medium text-ink/65">
          Signing out everywhere also invalidates every token already issued, so
          anything still open stops working.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="paper"
            onClick={() => end(LogoutAction.THIS_DEVICE)}
            disabled={busy}
          >
            <LogOut size={16} /> Log out here
          </Button>
          <Button
            variant="danger"
            onClick={() => setConfirmAll(true)}
            disabled={busy}
          >
            <MonitorSmartphone size={16} /> Log out everywhere
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmAll}
        title="Sign out of every device?"
        body="Every session ends immediately, including this one. You will need to log in again."
        confirmLabel="Sign out everywhere"
        pending={busy}
        onConfirm={() => end(LogoutAction.ALL_DEVICES)}
        onCancel={() => setConfirmAll(false)}
      />
    </>
  );
}
