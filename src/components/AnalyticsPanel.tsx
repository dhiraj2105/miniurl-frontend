"use client";

import { Analytics } from "@/types";

interface AnalyticsPanelProps {
  selected: Analytics | null;
  deleting: boolean;
  confirming: boolean;
  confirmText: string;
  setConfirming: (value: boolean) => void;
  setConfirmText: (value: string) => void;
  handleDelete: () => void;
}

export default function AnalyticsPanel({
  selected,
  deleting,
  confirming,
  confirmText,
  setConfirming,
  setConfirmText,
  handleDelete,
}: AnalyticsPanelProps) {
  return (
    <div
      className={`border border-gray-200 rounded-xl p-5 transition-opacity duration-300 ${
        deleting ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>

      {!selected ? (
        <p className="text-gray-600">Select a URL to view analytics</p>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Short URL</p>
            <p className="font-medium break-all">
              {process.env.NEXT_PUBLIC_API_BASE_URL}/{selected.shortCode}
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
              className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete URL
            </button>
          ) : (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
              <p className="text-sm text-red-700 font-medium">
                This action is permanent.
              </p>

              <p className="text-sm text-red-600">
                Type <span className="font-semibold">delete</span> to confirm.
              </p>

              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type delete"
                className="w-full border border-red-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== "delete" || deleting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>

                <button
                  onClick={() => {
                    setConfirming(false);
                    setConfirmText("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
