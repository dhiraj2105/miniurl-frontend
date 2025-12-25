import { api } from "./api";

export async function fetchAnalytics(shortCode: string) {
  const res = await api.get(`/api/analytics/${shortCode}`);
  return res.data;
}
