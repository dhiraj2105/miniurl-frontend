import { api } from "./api";

export async function registerUser(email: string, password: string) {
  const res = await api.post("/api/auth/register", {
    email,
    password,
  });

  return res.data.token;
}

export async function loginUser(email: string, password: string) {
  const res = await api.post("/api/auth/login", {
    email,
    password,
  });

  return res.data.token;
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/`;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; path=/";
}
