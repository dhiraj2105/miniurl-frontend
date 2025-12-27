// "use client";

// import { useEffect, useState } from "react";
// import { fetchAnalytics } from "@/lib/analytics";
// import { fetchUserUrls, shortenUrl, deleteUserUrl } from "@/lib/url";

// /* ---------- Types ---------- */
// type UrlItem = {
//   id: number;
//   shortCode: string;
//   originalUrl: string;
//   clickCount: number;
//   createdAt: string;
// };

// type Analytics = {
//   id: number;
//   shortCode: string;
//   originalUrl: string;
//   clickCount: number;
//   createdAt: string;
// };

// /* ---------- Type Guard ---------- */
// interface AxiosLikeError {
//   response?: {
//     status?: number;
//   };
// }

// function isAxiosLikeError(error: unknown): error is AxiosLikeError {
//   return typeof error === "object" && error !== null && "response" in error;
// }

// export default function DashboardPage() {
//   const [urls, setUrls] = useState<UrlItem[]>([]);
//   const [selected, setSelected] = useState<Analytics | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   /* ---- Shortener ---- */
//   const [url, setUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");
//   const [shortenError, setShortenError] = useState("");
//   const [shortenLoading, setShortenLoading] = useState(false);

//   /* ---- Delete ---- */
//   const [deleting, setDeleting] = useState(false);

//   /* ---------- Load URLs ---------- */
//   const loadUrls = () => {
//     setLoading(true);
//     fetchUserUrls()
//       .then(setUrls)
//       .catch(() => setError("Failed to load URLs"))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadUrls();
//   }, []);

//   /* ---------- Analytics (FIXED) ---------- */
//   const loadAnalytics = async (shortCode: string) => {
//     try {
//       const data = await fetchAnalytics(shortCode);

//       // ✅ FIX: map backend `Id` → frontend `id`
//       setSelected({
//         id: data.Id,
//         shortCode: data.shortCode,
//         originalUrl: data.originalUrl,
//         clickCount: data.clickCount,
//         createdAt: data.createdAt,
//       });
//     } catch {
//       setError("Failed to load analytics");
//     }
//   };

//   /* ---------- Shorten ---------- */
//   const handleShorten = async () => {
//     setShortenError("");
//     setShortUrl("");

//     if (!url) {
//       setShortenError("Please enter a URL");
//       return;
//     }

//     try {
//       setShortenLoading(true);
//       const data = await shortenUrl(url);
//       setShortUrl(data.shortUrl);
//       setUrl("");
//       loadUrls();
//     } catch (err: unknown) {
//       if (isAxiosLikeError(err) && err.response?.status === 429) {
//         setShortenError("Anonymous users can shorten only 1 URL");
//       } else {
//         setShortenError("Something went wrong. Try again.");
//       }
//     } finally {
//       setShortenLoading(false);
//     }
//   };

//   /* ---------- Delete ---------- */
//   const handleDelete = async () => {
//     if (!selected) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this URL? This action cannot be undone."
//     );

//     if (!confirmed) return;

//     try {
//       setDeleting(true);
//       await deleteUserUrl(selected.id);
//       setSelected(null);
//       loadUrls();
//     } catch {
//       setError("Failed to delete URL");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="flex flex-1 bg-white text-black px-4 sm:px-6 py-8">
//       <div className="w-full max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
//         </div>

//         {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}

//         {loading ? (
//           <p className="text-gray-600">Loading your URLs…</p>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* LEFT COLUMN */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Shorten */}
//               <div className="border border-gray-200 rounded-xl p-5">
//                 <h2 className="text-lg font-semibold mb-4">
//                   Shorten a new URL
//                 </h2>

//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <input
//                     type="text"
//                     placeholder="Enter your long URL here..."
//                     className="flex-1 border border-gray-300 rounded-lg px-4 py-3
//                       focus:outline-none focus:ring-2 focus:ring-black"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                   />

//                   <button
//                     onClick={handleShorten}
//                     disabled={shortenLoading}
//                     className="bg-black text-white px-6 py-3 rounded-lg
//                       hover:bg-gray-800 transition
//                       disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {shortenLoading ? "Shortening..." : "Shorten"}
//                   </button>
//                 </div>

//                 {shortenError && (
//                   <p className="text-red-500 mt-3 text-sm">{shortenError}</p>
//                 )}

//                 {shortUrl && (
//                   <div className="mt-4 border border-gray-200 bg-gray-50 px-4 py-3 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-1">
//                       Your shortened URL
//                     </p>
//                     <a
//                       href={shortUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-black font-medium underline break-all"
//                     >
//                       {shortUrl}
//                     </a>
//                   </div>
//                 )}
//               </div>

//               {/* URL LIST */}
//               <div className="border border-gray-200 rounded-xl p-5">
//                 <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

//                 {urls.length === 0 ? (
//                   <p className="text-gray-600">
//                     You haven’t created any URLs yet.
//                   </p>
//                 ) : (
//                   <ul className="space-y-3">
//                     {urls.map((item) => (
//                       <li
//                         key={item.id}
//                         onClick={() => loadAnalytics(item.shortCode)}
//                         className={`border border-gray-200 rounded-lg p-4
//                           cursor-pointer hover:bg-gray-50 transition
//                           ${selected?.id === item.id ? "bg-gray-50" : ""}`}
//                       >
//                         <p className="font-medium break-all">
//                           {process.env.NEXT_PUBLIC_API_BASE_URL}/
//                           {item.shortCode}
//                         </p>

//                         <p className="text-sm text-gray-600 truncate">
//                           {item.originalUrl}
//                         </p>

//                         <p className="text-sm text-gray-500 mt-1">
//                           Clicks: {item.clickCount}
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             {/* ANALYTICS */}
//             <div
//               className={`border border-gray-200 rounded-xl p-5
//                 transition-opacity duration-300
//                 ${deleting ? "opacity-50 pointer-events-none" : "opacity-100"}`}
//             >
//               <h2 className="text-lg font-semibold mb-4">Analytics</h2>

//               {!selected ? (
//                 <p className="text-gray-600">Select a URL to view analytics</p>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Short URL</p>
//                     <p className="font-medium break-all">
//                       {process.env.NEXT_PUBLIC_API_BASE_URL}/
//                       {selected.shortCode}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-500">Original URL</p>
//                     <p className="text-sm break-all">{selected.originalUrl}</p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-500">Click Count</p>
//                     <p className="text-2xl font-bold">{selected.clickCount}</p>
//                   </div>

//                   <p className="text-sm text-gray-500">
//                     Created on {new Date(selected.createdAt).toLocaleString()}
//                   </p>

//                   <button
//                     onClick={handleDelete}
//                     disabled={deleting}
//                     className="w-full bg-red-600 text-white py-2 rounded-lg
//                       hover:bg-red-700 transition
//                       disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {deleting ? "Deleting..." : "Delete URL"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { fetchAnalytics } from "@/lib/analytics";
import { fetchUserUrls, shortenUrl, deleteUserUrl } from "@/lib/url";

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
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [selected, setSelected] = useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---- Shortener ---- */
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortenError, setShortenError] = useState("");
  const [shortenLoading, setShortenLoading] = useState(false);

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

      // ✅ Normalize backend `Id`
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

  /* ---------- Shorten ---------- */
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
      loadUrls();
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
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        </div>

        {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading your URLs…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shorten */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Shorten a new URL
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your long URL here..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <button
                    onClick={handleShorten}
                    disabled={shortenLoading}
                    className="bg-black text-white px-6 py-3 rounded-lg
                      hover:bg-gray-800 transition
                      disabled:opacity-50"
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
                      className="font-medium underline break-all"
                    >
                      {shortUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* URL LIST */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

                <ul className="space-y-3">
                  {urls.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => loadAnalytics(item.shortCode)}
                      className={`border border-gray-200 rounded-lg p-4 cursor-pointer
                        hover:bg-gray-50 transition ${
                          selected?.id === item.id ? "bg-gray-50" : ""
                        }`}
                    >
                      <p className="font-medium break-all">
                        {process.env.NEXT_PUBLIC_API_BASE_URL}/{item.shortCode}
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
              </div>
            </div>

            {/* ANALYTICS */}
            <div
              className={`border border-gray-200 rounded-xl p-5 transition-opacity ${
                deleting ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">Analytics</h2>

              {!selected ? (
                <p className="text-gray-600">Select a URL to view analytics</p>
              ) : (
                <div className="space-y-4">
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

                  {/* DELETE CONFIRMATION */}
                  {!confirming ? (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg
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
                            disabled:opacity-50"
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
