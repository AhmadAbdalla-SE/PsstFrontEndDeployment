import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Button from "@/components/ui/Button";

const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif"];

export default function ImagePicker({ files, onChange, disabled }) {
  const input = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const add = (event) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!picked.length) return;

    const rejected = [];
    const accepted = picked.filter((file) => {
      if (!ACCEPTED.includes(file.type)) {
        rejected.push(`${file.name} is not a JPEG, PNG or GIF`);
        return false;
      }
      if (file.size > MAX_BYTES) {
        rejected.push(`${file.name} is bigger than 5 MB`);
        return false;
      }
      return true;
    });

    const room = MAX_FILES - files.length;
    if (accepted.length > room) {
      rejected.push(`Only ${MAX_FILES} images per message`);
    }

    setProblem(rejected[0] ?? null);
    if (accepted.length) {
      onChange([...files, ...accepted.slice(0, room)]);
    }
  };

  const remove = (index) => {
    setProblem(null);
    onChange(files.filter((_, position) => position !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        hidden
        onChange={add}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="paper"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={disabled || files.length >= MAX_FILES}
        >
          <ImagePlus size={15} />
          {files.length ? `${files.length}/${MAX_FILES} images` : "Add images"}
        </Button>
        <span className="text-xs font-medium text-ink/45">
          JPEG, PNG or GIF · 5 MB each
        </span>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={files[index]?.name ?? "Selected image"}
                className="h-20 w-20 border-3 border-ink object-cover shadow-brutal-sm"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${files[index]?.name ?? "image"}`}
                className="press absolute -top-2 -right-2 border-3 border-ink bg-psst-pink p-0.5 shadow-brutal-sm"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {problem && <p className="text-xs font-bold text-red-700">{problem}</p>}
    </div>
  );
}
