"use client";

import { UrlItem } from "@/types";

interface UrlListProps {
  urls: UrlItem[];
  selectedId: number | null;
  onSelect: (shortCode: string) => void;
}

export default function UrlList({ urls, selectedId, onSelect }: UrlListProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">Your URLs</h2>

      {urls.length === 0 ? (
        <p className="text-gray-600">You haven’t created any URLs yet.</p>
      ) : (
        <ul className="space-y-3">
          {urls.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item.shortCode)}
              className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${
                selectedId === item.id ? "bg-gray-50" : ""
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
      )}
    </div>
  );
}
