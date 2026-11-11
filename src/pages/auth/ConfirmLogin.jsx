import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import * as authApi from "@/api/auth.api";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { validateOtp } from "@/lib/validators";

export default function ConfirmLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { startSession } = useAuth();

  const email = location.state?.email;
  const destination = location.state?.from ?? "/inbox";

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = validateOtp({ otp });
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setPending(true);
    try {
      const tokens = await authApi.confirmLogin({ email, otp });
      await startSession(tokens);
      toast.success("Welcome back.");
      navigate(destination, { replace: true });
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Two step login"
      title="One more thing."
      subtitle={`We sent a 6 digit code to ${email}.`}
      footer={
        <Link to="/login" className="underline underline-offset-4">
          Use a different account
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setErrors((current) => ({ ...current, otp: undefined }));
          }}
          error={errors.otp}
          disabled={pending}
        />

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? <Spinner /> : <ShieldCheck size={18} />}
          {pending ? "Checking" : "Finish logging in"}
        </Button>
      </form>
    </AuthShell>
  );
}
