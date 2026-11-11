import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import * as authApi from "@/api/auth.api";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OtpInput from "@/components/ui/OtpInput";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import { useCooldown } from "@/hooks/useCooldown";
import { isEmail, validateOtp } from "@/lib/validators";

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const cooldown = useCooldown(60);

  const [email, setEmail] = useState(location.state?.email ?? "");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const next = validateOtp({ otp });
    if (!isEmail(email)) {
      next.email = "We need the email you signed up with";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setPending(true);
    try {
      await authApi.confirmEmail({ email: email.trim(), otp });
      toast.success("Email confirmed. You can log in now.");
      navigate("/login", { state: { email: email.trim() } });
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    if (!isEmail(email)) {
      setErrors({ email: "We need the email you signed up with" });
      return;
    }
    try {
      await authApi.resendConfirmEmail({ email: email.trim() });
      cooldown.start();
      toast.info("A new code is on its way.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthShell
      eyebrow="Step 2 of 2"
      title="Check your inbox."
      subtitle={
        email
          ? `We sent a 6 digit code to ${email}.`
          : "Enter the email you signed up with and the code we sent you."
      }
      footer={
        <Link to="/login" className="underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {!location.state?.email && (
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            error={errors.email}
          />
        )}

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
          {pending ? <Spinner /> : <MailCheck size={18} />}
          {pending ? "Checking" : "Confirm my email"}
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown.active}
          className="text-sm font-bold underline underline-offset-4 disabled:no-underline disabled:opacity-50"
        >
          {cooldown.active
            ? `Resend in ${cooldown.left}s`
            : "Didn't get it? Send another code"}
        </button>
      </form>
    </AuthShell>
  );
}
