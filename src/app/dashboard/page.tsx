"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/analytics";
import { fetchUserUrls, deleteUserUrl } from "@/lib/url";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import UrlList from "@/components/UrlList";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { UrlItem, Analytics } from "@/types";

export default function DashboardPage() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [selected, setSelected] = useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

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

              <UrlList
                urls={urls}
                selectedId={selected?.id || null}
                onSelect={loadAnalytics}
              />
            </div>

            <AnalyticsPanel
              selected={selected}
              deleting={deleting}
              confirming={confirming}
              confirmText={confirmText}
              setConfirming={setConfirming}
              setConfirmText={setConfirmText}
              handleDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
