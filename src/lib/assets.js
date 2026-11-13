import { API_BASE_URL } from "@/api/client";

const ORIGIN = String(API_BASE_URL).replace(/\/+$/, "");

export const assetUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const normalised = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalised) return null;

  return `${ORIGIN}/${normalised}`;
};

export const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
