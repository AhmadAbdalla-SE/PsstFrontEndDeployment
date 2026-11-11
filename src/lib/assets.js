import { API_BASE_URL } from "@/api/client";

export const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalised = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalised}`;
};

export const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
