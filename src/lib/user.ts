import { api } from "./api";

export async function getCurrentuser() {
  const res = await api.get("/api/user/me");
  return res.data;
}
