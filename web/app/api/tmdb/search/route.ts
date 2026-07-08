import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim() === "") {
        return NextResponse.json(
            { error: "Query parameter is required" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                // Next.js fetch caching — don't cache search results
                // since every query is unique and results change over time
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error(`TMDB responded with status ${res.status}`);
        }

        const data = await res.json();

        // Shape the response — only send what the frontend actually needs
        // Never forward the raw TMDB response wholesale
        const movies = data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
            release_date: movie.release_date,
            overview: movie.overview,
        }));

        return NextResponse.json(movies);
    } catch (error) {
        console.error("TMDB search error:", error);
        return NextResponse.json(
            { error: "Failed to fetch from TMDB" },
            { status: 500 }
        );
    }
}