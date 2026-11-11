import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export default function GoogleSignInButton({ onCredential, disabled }) {
  const holder = useRef(null);

  const callback = useRef(onCredential);
  callback.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID || !holder.current) return undefined;

    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google?.accounts?.id || !holder.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => callback.current(response.credential),
      });
      window.google.accounts.id.renderButton(holder.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        render();
      } else {
        existing.addEventListener("load", render);
      }
      return () => {
        cancelled = true;
        existing.removeEventListener("load", render);
      };
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", render);
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-ink/15" />
        <span className="text-xs font-black uppercase tracking-widest text-ink/40">
          or
        </span>
        <span className="h-0.5 flex-1 bg-ink/15" />
      </div>

      <div
        ref={holder}
        className={disabled ? "pointer-events-none opacity-50" : undefined}
      />
    </div>
  );
}
