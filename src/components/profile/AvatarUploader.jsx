import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import * as userApi from "@/api/user.api";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const MAX_BYTES = 3 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif"];

export default function AvatarUploader() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error("Pick a JPEG, PNG or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That image is over 3 MB.");
      return;
    }

    setUploading(true);
    try {
      const data = await userApi.uploadProfileImage(file);
      setUser(data?.user ?? data);
      toast.success("New photo saved.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar name={user?.username} image={user?.image} size={76} />
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-paper/70">
            <Spinner size={22} />
          </span>
        )}
      </div>

      <div>
        <input
          ref={input}
          type="file"
          accept={ACCEPTED.join(",")}
          hidden
          onChange={pick}
        />
        <Button
          type="button"
          variant="paper"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={uploading}
        >
          <Camera size={15} /> {user?.image ? "Change photo" : "Add a photo"}
        </Button>
        <p className="mt-1.5 text-xs font-medium text-ink/45">
          JPEG, PNG or GIF · up to 3 MB
        </p>
      </div>
    </div>
  );
}
