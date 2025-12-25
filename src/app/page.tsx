"use client";

import { shortenUrl } from "@/lib/url";
import { useState } from "react";

/* ---------- Type Guards ---------- */
interface AxiosLikeError {
  response?: {
    status?: number;
  };
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === "object" && error !== null && "response" in error;
}

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");

    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      const data = await shortenUrl(url);
      setShortUrl(data.shortUrl);
    } catch (err: unknown) {
      if (isAxiosLikeError(err) && err.response?.status === 429) {
        setError("Anonymous users can shorten only 1 URL");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-white text-black px-4">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Shorten URLs Instantly
          </h2>

          <p className="text-gray-600 mb-8">
            Shorten your long URLs instantly. Track clicks and manage links by
            creating a free account.
          </p>

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
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-lg
              hover:bg-gray-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          {shortUrl && (
            <div className="mt-6 border border-gray-200 bg-gray-50 px-4 py-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your shortened URL</p>
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
      </main>
    </div>
  );
}
