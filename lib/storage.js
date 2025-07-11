import { storage_url } from "./configs.js";

export function buildFileUrl(endpoint) {
  if (!endpoint) return null;

  const isFullUrl = endpoint.startsWith("http://") || endpoint.startsWith("https://");
  return isFullUrl ? endpoint : `${storage_url}/${endpoint.replace(/^\/+/, "")}`;
}