"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/analytics";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { fetchUserUrls } from "@/lib/url";

type UrlItem = {
  id: number;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

type Analytics = {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [selected, setSelected] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserUrls()
      .then(setUrls)
      .catch(() => setError("Failed to load URLs"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const loadAnalytics = async (shortCode: string) => {
    try {
      const data = await fetchAnalytics(shortCode);
      setSelected(data);
    } catch {
      setError("Failed to load analytics");
    }
  };

  return (
    <div className="flex flex-1 bg-white text-black px-4 sm:px-6 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

          <button
            onClick={handleLogout}
            className="border border-black px-4 py-2 rounded-lg
              hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}

        {/* Content */}
        {loading ? (
          <p className="text-gray-600">Loading your URLs…</p>
        ) : urls.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600">You haven’t created any URLs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* URL List */}
            <div className="lg:col-span-2 border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

              <ul className="space-y-3">
                {urls.map((url) => (
                  <li
                    key={url.id}
                    onClick={() => loadAnalytics(url.shortCode)}
                    className="border border-gray-200 rounded-lg p-4
                      cursor-pointer hover:bg-gray-50 transition"
                  >
                    <p className="font-medium">
                      {process.env.NEXT_PUBLIC_API_BASE_URL}/{url.shortCode}
                    </p>

                    <p className="text-sm text-gray-600 truncate">
                      {url.originalUrl}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Clicks: {url.clickCount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Analytics */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-4">Analytics</h2>

              {!selected ? (
                <p className="text-gray-600">Select a URL to view analytics</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Short URL</p>
                    <p className="font-medium break-all">
                      {process.env.NEXT_PUBLIC_API_BASE_URL}/
                      {selected.shortCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Original URL</p>
                    <p className="text-sm break-all">{selected.originalUrl}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Click Count</p>
                    <p className="text-2xl font-bold">{selected.clickCount}</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    Created on {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
