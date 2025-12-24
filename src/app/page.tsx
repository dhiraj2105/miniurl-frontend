"use client";

import { shortenUrl } from "@/lib/url";
import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("DATA-> ", data);

      setShortUrl(`${data.shortUrl}`);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Anonymous users can shorten only 1 URL");
        console.log(err);
      } else {
        setError("Something went wrong. Try agin.");
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-4">
      <h1>MiniUrl</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Shorten your long URLs instantly. Track clicks and manage links by
        creating a free account.
      </p>

      <div className="w-full max-w-xl flex gap-2">
        <input
          type="text"
          placeholder="Enter your long URL here..."
          className="flex-1 border rounded-lg px-4 py-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleShorten}
          disabled={loading}
          className="bg-black text-white px-6
         py-2 rounded-lg hover:bg-gray-800
         disabled:opacity-50 cursor-pointer border"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {shortUrl && (
        <div className="mt-6 bg-gray-100 px-3 py-4 rounded-lg">
          <p className="text-sm text-gray-600">Your shortened URL</p>
          <a
            href={shortUrl}
            target="_blank"
            className="
          text-blue-600 font-medium"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </main>
  );
}
