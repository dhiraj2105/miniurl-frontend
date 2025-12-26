"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/analytics";
import { fetchUserUrls, shortenUrl } from "@/lib/url";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */
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

/* ---------- Type Guard ---------- */
interface AxiosLikeError {
  response?: {
    status?: number;
  };
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === "object" && error !== null && "response" in error;
}

export default function DashboardPage() {
  const router = useRouter();

  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [selected, setSelected] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---- Shortener form state ---- */
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortenError, setShortenError] = useState("");
  const [shortenLoading, setShortenLoading] = useState(false);

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
      setSelected(data);
    } catch {
      setError("Failed to load analytics");
    }
  };

  /* ---------- Shorten URL ---------- */
  const handleShorten = async () => {
    setShortenError("");
    setShortUrl("");

    if (!url) {
      setShortenError("Please enter a URL");
      return;
    }

    try {
      setShortenLoading(true);
      const data = await shortenUrl(url);
      setShortUrl(data.shortUrl);
      setUrl("");
      loadUrls(); // refresh dashboard URLs
    } catch (err: unknown) {
      if (isAxiosLikeError(err) && err.response?.status === 429) {
        setShortenError("Anonymous users can shorten only 1 URL");
      } else {
        setShortenError("Something went wrong. Try again.");
      }
    } finally {
      setShortenLoading(false);
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

        {/* Content */}
        {loading ? (
          <p className="text-gray-600">Loading your URLs…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* -------- Shortener Form (same as landing) -------- */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Shorten a new URL
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter your long URL here..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 focus:ring-black"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />

                  <button
                    onClick={handleShorten}
                    disabled={shortenLoading}
                    className="bg-black text-white px-6 py-3 rounded-lg
                      hover:bg-gray-800 transition
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {shortenLoading ? "Shortening..." : "Shorten"}
                  </button>
                </div>

                {shortenError && (
                  <p className="text-red-500 mt-3 text-sm">{shortenError}</p>
                )}

                {shortUrl && (
                  <div className="mt-4 border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Your shortened URL
                    </p>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-medium underline break-all"
                    >
                      {shortUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* -------- URL List -------- */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

                {urls.length === 0 ? (
                  <p className="text-gray-600">
                    You haven’t created any URLs yet.
                  </p>
                ) : (
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
                )}
              </div>
            </div>

            {/* -------- Analytics -------- */}
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
