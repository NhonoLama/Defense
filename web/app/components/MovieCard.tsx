"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Movie {
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Check if movie exists in DB
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/check/${encodeURIComponent(movie.title)}`,
      );
      const checkData = await checkRes.json();

      // Add to DB if it doesn't exist yet
      if (!checkData.exists) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            overview: movie.overview,
          }),
        });
      }

      // Scrape comments
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/scrape-comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: movie.title }),
      });

      router.push(`/movies/${encodeURIComponent(movie.title)}`);
    } catch (err) {
      console.error("Error handling movie click:", err);
      setLoading(false);
    }
  };

  const posterSrc = movie.poster_path?.startsWith("http")
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-xl bg-surface overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-foreground/50">Loading...</p>
        </div>
      ) : (
        <>
          <div className="relative h-[300px] w-full overflow-hidden">
            <Image
              src={posterSrc}
              alt={movie.title || "Movie poster"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="p-3">
            <h3 className="font-display text-sm font-semibold leading-tight line-clamp-1">
              {movie.title}
            </h3>
            <p className="mt-1 text-xs text-foreground/50">
              {movie.release_date}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
