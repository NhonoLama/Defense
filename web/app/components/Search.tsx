"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import MovieCard from "./MovieCard";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

async function searchTMDB(query: string): Promise<TMDBMovie[]> {
  const res = await fetch(
    `/api/tmdb/search?query=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setMovies([]);
    setError(null);
    setLoading(true);

    try {
      const results = await searchTMDB(q);
      if (results.length === 0) setError("No movies found.");
      else setMovies(results);
    } catch {
      setError("Error fetching results.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie..."
          className="flex-1 rounded-full border border-white/10 bg-surface px-5 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <SearchIcon size={16} />
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-naramro">{error}</p>}

      {movies.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
