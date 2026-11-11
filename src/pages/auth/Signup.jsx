import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import * as authApi from "@/api/auth.api";
import AuthShell from "@/components/auth/AuthShell";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Gender } from "@/lib/enums";
import { PASSWORD_SPECIALS, validateSignup } from "@/lib/validators";

const EMPTY = {
  username: "",
  email: "",
  phone: "",
  gender: Gender.MALE,
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { startSession } = useAuth();

  const update = (field) => (event) => {
    const raw = event.target.value;
    setValues((current) => ({
      ...current,
      [field]: field === "gender" ? Number(raw) : raw,
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = validateSignup(values);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setPending(true);
    try {
      await authApi.signup({
        username: values.username.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        gender: values.gender,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Account created. Check your email for the code.");
      navigate("/confirm-email", { state: { email: values.email.trim() } });
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
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
      navigate("/inbox", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Step 1 of 2"
      title="Get your link."
      subtitle="One link, and people can start telling you things they would never say to your face."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Full name"
          name="username"
          autoComplete="name"
          placeholder="Ahmed Abdalla"
          hint="First and last name — the backend splits them apart."
          value={values.username}
          onChange={update("username")}
          error={errors.username}
        />

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

        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+201234567890"
          hint="International format, starting with +"
          value={values.phone}
          onChange={update("phone")}
          error={errors.phone}
        />

        <Input
          as="select"
          label="Gender"
          name="gender"
          value={values.gender}
          onChange={update("gender")}
          error={errors.gender}
        >
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
        </Input>

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint={`8–16 characters, one capital, one small letter and one of ${PASSWORD_SPECIALS}`}
          value={values.password}
          onChange={update("password")}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={update("confirmPassword")}
          error={errors.confirmPassword}
        />

        <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
          {pending ? <Spinner /> : <UserPlus size={18} />}
          {pending ? "Creating" : "Create my account"}
        </Button>

        <GoogleSignInButton onCredential={handleGoogle} disabled={pending} />
      </form>
    </AuthShell>
  );
}
