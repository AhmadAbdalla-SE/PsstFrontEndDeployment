import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import * as userApi from "@/api/user.api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import OtpInput from "@/components/ui/OtpInput";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { LoginType } from "@/lib/enums";
import { isOtp } from "@/lib/validators";

export default function TwoFactorCard() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();

  const enabled = user?.loginType === LoginType.TWO_STEP;

  const [stage, setStage] = useState("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const requestCode = async () => {
    setBusy(true);
    try {
      await userApi.requestTwoFactor();
      setOtp("");
      setError(null);
      setStage("confirming");
      toast.info("We sent a code to your email.");
    } catch (requestError) {
      if (requestError.status === 409) {
        setOtp("");
        setError(null);
        setStage("confirming");
        toast.info(requestError.message);
      } else {
        toast.error(requestError.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (event) => {
    event.preventDefault();
    if (!isOtp(otp)) {
      setError("The code is 6 digits");
      return;
    }

    setBusy(true);
    try {
      await userApi.verifyTwoFactor({ otp });
      await refreshProfile();
      setStage("idle");
      setOtp("");
      toast.success(
        enabled ? "Two step login is off." : "Two step login is on."
      );
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card tone="white" className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight">Two step login</h2>
          <p className="mt-1 max-w-md text-sm font-medium text-ink/65">
            With this on, your password alone is not enough — we email you a
            code every time you log in.
          </p>
        </div>

        <Badge tone={enabled ? "mint" : "paper"}>
          {enabled ? (
            <ShieldCheck size={11} className="mr-1 inline" />
          ) : (
            <ShieldOff size={11} className="mr-1 inline" />
          )}
          {enabled ? "On" : "Off"}
        </Badge>
      </div>

      {stage === "idle" ? (
        <Button
          variant={enabled ? "paper" : "lime"}
          className="mt-5"
          onClick={requestCode}
          disabled={busy}
        >
          {busy ? <Spinner size={16} /> : null}
          {enabled ? "Turn it off" : "Turn it on"}
        </Button>
      ) : (
        <form onSubmit={confirm} className="mt-5 flex flex-col gap-4">
          <p className="text-sm font-bold">
            Enter the code we emailed to {user?.email} to{" "}
            {enabled ? "turn two step login off" : "turn it on"}.
          </p>

          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(null);
            }}
            error={error}
            disabled={busy}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? <Spinner size={16} /> : <ShieldCheck size={16} />}
              Confirm
            </Button>
            <Button
              type="button"
              variant="paper"
              onClick={() => {
                setStage("idle");
                setError(null);
              }}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
