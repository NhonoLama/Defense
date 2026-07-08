"use client";

import { useState } from "react";

export default function WatchlistButton({ movieId }: { movieId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">(
    "idle",
  );

  const handleAddToWatchlist = async () => {
    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/watchlist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ movieId }),
        },
      );
      if (!res.ok) throw new Error();
      setStatus("added");
    } catch {
      setStatus("error");
    }
  };

  return (
    <button
      onClick={handleAddToWatchlist}
      disabled={status === "loading" || status === "added"}
      className="mt-6 rounded-full bg-accent px-5 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {status === "added"
        ? "Added ✓"
        : status === "loading"
          ? "Adding..."
          : "Add to Watchlist"}
    </button>
  );
}
