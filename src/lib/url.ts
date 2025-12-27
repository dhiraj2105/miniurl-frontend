import { api } from "./api";

export async function shortenUrl(originalUrl: string) {
  const response = await api.post("/api/shorten", {
    originalUrl,
  });
  return response.data;
}

export async function fetchUserUrls() {
  const res = await api.get("/api/user/urls");
  return res.data;
}

export async function deleteUserUrl(urlId: number) {
  await api.delete(`/api/user/urls/${urlId}`);
}
