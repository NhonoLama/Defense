"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "./MovieCard";

interface Movie {
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

export default function SlideComp() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Fetch popular movies via our server-side proxy (keeps TMDB token safe)
        const tmdbRes = await fetch("/api/tmdb/popular");
        const tmdbMovies: Movie[] = await tmdbRes.json();

        // Save to DB (backend deduplicates)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-movies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tmdbMovies),
        });

        // Load from DB so we display what's actually stored
        const dbRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
        const dbMovies = await dbRes.json();
        setMovies(dbMovies);
      } catch (err) {
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) {
    return (
      <section className="px-6 py-12">
        <div className="h-7 w-40 animate-pulse rounded bg-surface" />
        <div className="mt-6 grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] animate-pulse rounded-xl bg-surface"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12">
      <h2 className="font-display text-2xl font-bold">What&apos;s Popular</h2>
      <div className="mt-6">
        <Slider {...settings}>
          {movies.map((movie, i) => (
            <div key={i} className="px-2">
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
