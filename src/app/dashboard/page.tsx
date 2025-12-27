"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/analytics";
import { fetchUserUrls, deleteUserUrl } from "@/lib/url";
import UrlShortenerForm from "@/components/UrlShortenerForm";

/* ---------- Types ---------- */
type UrlItem = {
  id: number;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

type Analytics = {
  id: number;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
};

export default function DashboardPage() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [selected, setSelected] = useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---- Delete ---- */
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  /* ---------- Load URLs ---------- */
  const loadUrls = () => {
    setLoading(true);
    fetchUserUrls()
      .then(setUrls)
      .catch(() => setError("Failed to load URLs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUrls();
  }, []);

  /* ---------- Analytics ---------- */
  const loadAnalytics = async (shortCode: string) => {
    try {
      const data = await fetchAnalytics(shortCode);

      setSelected({
        id: data.Id,
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
        clickCount: data.clickCount,
        createdAt: data.createdAt,
      });

      setConfirming(false);
      setConfirmText("");
    } catch {
      setError("Failed to load analytics");
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async () => {
    if (!selected) return;

    try {
      setDeleting(true);
      await deleteUserUrl(selected.id);
      setSelected(null);
      setConfirming(false);
      setConfirmText("");
      loadUrls();
    } catch {
      setError("Failed to delete URL");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 bg-white text-black px-4 sm:px-6 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        </div>

        {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading your URLs…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Shorten a new URL
                </h2>

                <UrlShortenerForm onSuccess={loadUrls} />
              </div>

              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

                {urls.length === 0 ? (
                  <p className="text-gray-600">
                    You haven’t created any URLs yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {urls.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => loadAnalytics(item.shortCode)}
                        className={`border border-gray-200 rounded-lg p-4
                          cursor-pointer hover:bg-gray-50 transition
                          ${selected?.id === item.id ? "bg-gray-50" : ""}`}
                      >
                        <p className="font-medium">
                          {process.env.NEXT_PUBLIC_API_BASE_URL}/
                          {item.shortCode}
                        </p>

                        <p className="text-sm text-gray-600 truncate">
                          {item.originalUrl}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Clicks: {item.clickCount}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div
              className={`border border-gray-200 rounded-xl p-5
                transition-opacity duration-300
                ${deleting ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
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

                  {!confirming ? (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg
                        hover:bg-red-700 transition"
                    >
                      Delete URL
                    </button>
                  ) : (
                    <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-red-700 font-medium">
                        This action is permanent.
                      </p>

                      <p className="text-sm text-red-600">
                        Type <span className="font-semibold">delete</span> to
                        confirm.
                      </p>

                      <input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type delete"
                        className="w-full border border-red-300 rounded-lg px-3 py-2
                          focus:outline-none focus:ring-2 focus:ring-red-500"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={handleDelete}
                          disabled={confirmText !== "delete" || deleting}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg
                            hover:bg-red-700 transition
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting ? "Deleting..." : "Confirm Delete"}
                        </button>

                        <button
                          onClick={() => {
                            setConfirming(false);
                            setConfirmText("");
                          }}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg
                            hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
