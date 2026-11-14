import { useEffect, useState } from "react";
import axios from "axios";
import { THROUGH_NGROK } from "@/api/client";

const blobCache = new Map();

export default function AssetImage({
  src,
  alt = "",
  className,
  loading = "lazy",
  ...rest
}) {
  const [resolved, setResolved] = useState(() =>
    THROUGH_NGROK ? (blobCache.get(src) ?? null) : src
  );

  useEffect(() => {
    if (!THROUGH_NGROK || !src) return undefined;

    const cached = blobCache.get(src);
    if (cached) {
      setResolved(cached);
      return undefined;
    }

    let cancelled = false;
    setResolved(null);

    axios
      .get(src, {
        responseType: "blob",
        headers: { "ngrok-skip-browser-warning": "true" },
      })
      .then((response) => {
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(response.data);
        blobCache.set(src, objectUrl);
        setResolved(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setResolved(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!THROUGH_NGROK) {
    return (
      <img src={src} alt={alt} className={className} loading={loading} {...rest} />
    );
  }

  if (!resolved) {
    return <span className={className} aria-hidden="true" {...rest} />;
  }

  return <img src={resolved} alt={alt} className={className} {...rest} />;
}
