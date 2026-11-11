import { useState } from "react";
import { Save } from "lucide-react";
import * as userApi from "@/api/user.api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Gender } from "@/lib/enums";
import { isPhone } from "@/lib/validators";

const toForm = (user) => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  phone: user?.phone ?? "",
  gender: user?.gender ?? Gender.MALE,
  DOB: user?.DOB ? String(user.DOB).slice(0, 10) : "",
});

export default function ProfileDetailsForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [values, setValues] = useState(() => toForm(user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

    const next = {};
    if (values.firstName.trim().length < 2) next.firstName = "At least 2 characters";
    if (values.lastName.trim().length < 2) next.lastName = "At least 2 characters";
    if (values.phone && !isPhone(values.phone.trim())) {
      next.phone = "Use the international form, like +201234567890";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const original = toForm(user);
    const payload = {};
    if (values.firstName.trim() !== original.firstName) payload.firstName = values.firstName.trim();
    if (values.lastName.trim() !== original.lastName) payload.lastName = values.lastName.trim();
    if (values.phone.trim() !== original.phone) payload.phone = values.phone.trim();
    if (values.gender !== original.gender) payload.gender = values.gender;
    if (values.DOB !== original.DOB) payload.DOB = values.DOB;

    if (!Object.keys(payload).length) {
      toast.info("Nothing changed.");
      return;
    }

    setSaving(true);
    try {
      const data = await userApi.updateProfile(payload);
      setUser(data?.user ?? data);
      toast.success("Profile updated.");
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          value={values.firstName}
          onChange={update("firstName")}
          error={errors.firstName}
        />
        <Input
          label="Last name"
          value={values.lastName}
          onChange={update("lastName")}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Phone"
        type="tel"
        placeholder="+201234567890"
        hint="Stored encrypted. Only you ever see it."
        value={values.phone}
        onChange={update("phone")}
        error={errors.phone}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          as="select"
          label="Gender"
          value={values.gender}
          onChange={update("gender")}
          error={errors.gender}
        >
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
        </Input>

        <Input
          label="Date of birth"
          type="date"
          value={values.DOB}
          onChange={update("DOB")}
          error={errors.DOB}
        />
      </div>

      <Input label="Email" value={user?.email ?? ""} readOnly disabled />

      <Button type="submit" disabled={saving} className="mt-1 self-start">
        {saving ? <Spinner size={16} /> : <Save size={16} />}
        {saving ? "Saving" : "Save changes"}
      </Button>
    </form>
  );
}
