"use client";

import { UrlItem, SortOption } from "@/types";

interface UrlListProps {
  urls: UrlItem[];
  selectedId: number | null;
  onSelect: (shortCode: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

function sortUrls(urls: UrlItem[], sortBy: SortOption) {
  const sorted = [...urls];

  switch (sortBy) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case "most-clicks":
      return sorted.sort((a, b) => b.clickCount - a.clickCount);

    case "least-clicks":
      return sorted.sort((a, b) => a.clickCount - b.clickCount);

    case "newest":
    default:
      return sorted; // already sorted by backend
  }
}

export default function UrlList({
  urls,
  selectedId,
  onSelect,
  sortBy,
  onSortChange,
}: UrlListProps) {
  const sortedUrls = sortUrls(urls, sortBy);

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your URLs</h2>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="border border-black px-4 py-2 rounded-lg
             text-black font-medium
             hover:bg-black hover:text-white
             transition cursor-pointer"
        >
          <option className="cursor-pointer" value="newest">
            Newest
          </option>
          <option className="cursor-pointer" value="oldest">
            Oldest
          </option>
          <option className="cursor-pointer" value="most-clicks">
            Most clicks
          </option>
          <option className="cursor-pointer" value="least-clicks">
            Least clicks
          </option>
        </select>
      </div>

      {sortedUrls.length === 0 ? (
        <p className="text-gray-600">You haven’t created any URLs yet.</p>
      ) : (
        <ul className="space-y-3">
          {sortedUrls.map((item) => (
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

              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500">
                  Clicks: {item.clickCount}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
