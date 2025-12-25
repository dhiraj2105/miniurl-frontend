"use client";

import { fetchAnalytics } from "@/lib/analytics";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Analytics = {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const shortCode = "KUEr78"; // TEMP; will replace with dynamic user URLs later

    fetchAnalytics(shortCode)
      .then(setData)
      .catch(() => setError("Failed to load analytics"));
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded-lg border cursor-pointer"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="border rounded p-6 max-w-2xl">
          <p className="text-sm text-gray-500 mb-2">Short URL</p>
          <p className="font-medium mb-4">
            {window.location.origin}/{data.shortCode}
          </p>

          <p className="text-sm text-gray-500 mb-2">Original URL</p>
          <p className="break-all mb-4">{data.originalUrl}</p>

          <p className="text-sm text-gray-500 mb-2">Click Count</p>
          <p className="text-xl font-bold mb-4">{data.clickCount}</p>

          <p className="text-sm text-gray-500">
            Created At: {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  );
}
