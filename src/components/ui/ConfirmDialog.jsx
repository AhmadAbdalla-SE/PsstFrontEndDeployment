import { useEffect } from "react";
import Button from "./Button";
import Card from "./Card";
import Spinner from "./Spinner";

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Yes, do it",
  cancelLabel = "Cancel",
  tone = "danger",
  pending,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-ink/40"
      />

      <Card tone="white" className="relative w-full max-w-md p-6 shadow-brutal-lg">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        {body && <p className="mt-2 text-sm font-medium text-ink/70">{body}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="paper" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={pending}>
            {pending && <Spinner />}
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
