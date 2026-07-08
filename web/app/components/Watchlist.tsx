"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Movie {
  _id: string;
  title: string;
  poster_path: string;
  release_date: string;
}

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/watchlist`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch watchlist");
        const data = await res.json();
        setMovies(data.watchlist || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/watchlist/${movieId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to remove");
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-foreground/50">Loading watchlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-naramro">{error}</p>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-foreground/50">Your watchlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold">Your Watchlist</h1>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="group relative rounded-xl bg-surface overflow-hidden"
          >
            <Image
              src={movie.poster_path}
              alt={movie.title}
              width={300}
              height={450}
              className="w-full object-cover"
            />
            <div className="p-3">
              <h2 className="font-display text-sm font-semibold leading-tight">
                {movie.title}
              </h2>
              <p className="mt-1 text-xs text-foreground/50">
                {movie.release_date?.split("-")[0]}
              </p>
              <button
                onClick={() => handleRemove(movie._id)}
                className="mt-3 w-full rounded-full border border-naramro/40 py-1.5 text-xs text-naramro transition-colors hover:bg-naramro hover:text-background"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
