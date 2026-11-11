import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import ImagePicker from "@/components/message/ImagePicker";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function Composer({ onSend, sending }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event?.preventDefault();

    const trimmed = content.trim();
    if (!trimmed && !files.length) {
      setError("Write something, or add an image");
      return;
    }
    if (trimmed && trimmed.length < 2) {
      setError("That is too short");
      return;
    }

    setError(null);
    const ok = await onSend({ content: trimmed || undefined, attachments: files });
    if (ok) {
      setContent("");
      setFiles([]);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border-t-3 border-ink bg-paper-dim p-3 sm:p-4"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setError(null);
          }}
          onKeyDown={onKeyDown}
          rows={1}
          maxLength={50000}
          placeholder="Say something…"
          aria-label="Your reply"
          className="max-h-40 min-h-12 w-full resize-y border-3 border-ink bg-white px-3 py-2.5 text-base font-semibold shadow-brutal-sm placeholder:font-medium placeholder:text-ink/35 focus:shadow-brutal focus:outline-none"
        />

        <Button type="submit" disabled={sending} aria-label="Send reply">
          {sending ? <Spinner size={18} /> : <SendHorizontal size={18} />}
        </Button>
      </div>

      <div className="mt-2">
        <ImagePicker files={files} onChange={setFiles} disabled={sending} />
      </div>

      {error && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
    </form>
  );
}
