import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, MailQuestion, RotateCcw } from "lucide-react";
import * as authApi from "@/api/auth.api";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OtpInput from "@/components/ui/OtpInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { isEmail, validateNewPassword, validateOtp } from "@/lib/validators";

const STEPS = ["Your email", "The code", "New password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const fail = (error) => {
    setErrors(error.fieldErrors ?? {});
    toast.error(error.message);
  };

  const requestCode = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setErrors({ email: "That does not look like an email address" });
      return;
    }

    setPending(true);
    try {
      await authApi.requestForgotPasswordCode({ email: email.trim() });
      toast.info("If that account exists, a code is on its way.");
      setErrors({});
      setStep(1);
    } catch (error) {
      fail(error);
    } finally {
      setPending(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    const clientErrors = validateOtp({ otp });
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setPending(true);
    try {
      await authApi.verifyForgotPasswordCode({ email: email.trim(), otp });
      setErrors({});
      setStep(2);
    } catch (error) {
      fail(error);
    } finally {
      setPending(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    const clientErrors = validateNewPassword(passwords);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setPending(true);
    try {
      await authApi.resetForgotPassword({
        email: email.trim(),
        otp,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword,
      });
      toast.success("Password changed. Log in with the new one.");
      navigate("/login", { state: { email: email.trim() } });
    } catch (error) {
      fail(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Locked out?"
      subtitle="Three quick steps and you are back in."
      footer={
        <Link to="/login" className="underline underline-offset-4">
          Back to log in
        </Link>
      }
    >
      <ol className="mb-6 flex gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex-1">
            <div
              className={cn(
                "h-2 border-2 border-ink",
                index <= step ? "bg-psst-lime" : "bg-paper-dim"
              )}
            />
            <span
              className={cn(
                "mt-1.5 block text-[10px] font-black uppercase tracking-widest",
                index === step ? "text-ink" : "text-ink/40"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form onSubmit={requestCode} noValidate className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors({});
            }}
            error={errors.email}
          />
          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? <Spinner /> : <MailQuestion size={18} />}
            {pending ? "Sending" : "Send me a code"}
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={verifyCode} noValidate className="flex flex-col gap-5">
          <p className="text-sm font-medium text-ink/70">
            We sent a 6 digit code to <strong>{email}</strong>.
          </p>

          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setErrors({});
            }}
            error={errors.otp}
            disabled={pending}
          />

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? <Spinner /> : <KeyRound size={18} />}
            {pending ? "Checking" : "Check my code"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep(0);
              setErrors({});
            }}
            className="flex items-center justify-center gap-1.5 text-sm font-bold underline underline-offset-4"
          >
            <RotateCcw size={14} /> Use a different email
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword} noValidate className="flex flex-col gap-4">
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={passwords.password}
            onChange={(event) => {
              setPasswords((current) => ({ ...current, password: event.target.value }));
              setErrors({});
            }}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={passwords.confirmPassword}
            onChange={(event) => {
              setPasswords((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }));
              setErrors({});
            }}
            error={errors.confirmPassword}
          />

          <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
            {pending ? <Spinner /> : <KeyRound size={18} />}
            {pending ? "Saving" : "Set my new password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
