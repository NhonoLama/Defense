import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET() {
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/popular?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        // Cache popular movies for 1 hour — this list doesn't change
        // per-request, so caching is safe and reduces TMDB API calls
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error(`TMDB responded with status ${res.status}`);
    }

    const data = await res.json();

    const movies = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.original_title,
      poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      release_date: movie.release_date,
      overview: movie.overview,
    }));

    return NextResponse.json(movies);
  } catch (error) {
    console.error("TMDB popular error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}