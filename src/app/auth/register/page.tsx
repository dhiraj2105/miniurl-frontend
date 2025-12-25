"use client";

import { registerUser, saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = await registerUser(email, password);
      saveToken(token);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-xl bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Create your account
        </h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Start shortening and managing your links
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
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg
              hover:bg-gray-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Login link */}
          <p className="text-sm text-gray-600 text-center pt-2">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-black font-medium underline hover:text-gray-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
