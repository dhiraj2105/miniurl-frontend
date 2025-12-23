import { api } from "./api";

export async function shortenUrl(originalUrl: string) {
  const response = await api.post("/api/shorten", {
    originalUrl,
  });
  return response.data;
}
