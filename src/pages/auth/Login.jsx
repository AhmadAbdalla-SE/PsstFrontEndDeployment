import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import * as authApi from "@/api/auth.api";
import AuthShell from "@/components/auth/AuthShell";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { validateLogin } from "@/lib/validators";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { startSession } = useAuth();

  const [values, setValues] = useState({
    email: location.state?.email ?? "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const destination = location.state?.from ?? "/inbox";

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = validateLogin(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setPending(true);
    try {
      const tokens = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!tokens?.access_token) {
        toast.info("We sent a code to your email.");
        navigate("/confirm-login", {
          state: { email: values.email.trim(), from: destination },
        });
        return;
      }

      await startSession(tokens);
      toast.success("Welcome back.");
      navigate(destination, { replace: true });
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(
        error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : error.message
      );
    } finally {
      setPending(false);
    }
  };

  const handleGoogle = async (idToken) => {
    setPending(true);
    try {
      const tokens = await authApi.loginWithGoogle({ idToken });
      await startSession(tokens);
      toast.success("Signed in with Google");
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in."
      subtitle="Your inbox is where you left it."
      footer={
        <>
          No account yet?{" "}
          <Link to="/signup" className="underline underline-offset-4">
            Get your link
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={update("email")}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        />

        <div className="flex flex-wrap justify-between gap-2 text-sm font-bold">
          <Link to="/forgot-password" className="underline underline-offset-4">
            Forgot your password?
          </Link>
          <Link to="/confirm-email" className="underline underline-offset-4">
            Never confirmed your email?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? <Spinner /> : <LogIn size={18} />}
          {pending ? "Checking" : "Log in"}
        </Button>

        <GoogleSignInButton onCredential={handleGoogle} disabled={pending} />
      </form>
    </AuthShell>
  );
}
