"use client";

import { useState } from "react";
import { loginUser, saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth();
  const handleLogin = async () => {
    setError("");

    try {
      setLoading(true);
      const token = await loginUser(email, password);
      saveToken(token);

      await refreshUser(); // update navbar instantly
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-xl bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome back</h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Log in to manage your shortened URLs
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg
              hover:bg-gray-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-sm text-gray-600 text-center pt-2">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-black font-medium underline hover:text-gray-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
