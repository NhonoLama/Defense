import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SlideComp.css";
import useFetchFromDB from "../hooks/useFetchFromDB";
import MovieCard from "./MovieCard"; // Import the new MovieCard component

// Fetch popular movies from TMDB API
const fetchPopularMoviesFromTMDB = async () => {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTJlODlhYzM2Njc3ZDMxYWE4ZGQ5ZDQ0ZjdlNGYxMCIsIm5iZiI6MTcyNjg4NTA1My41MzY1ODQsInN1YiI6IjY2ZGRjZDQxYmI3ZGU5ZjIzNzM4YzM1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gJwYz8jgR1R3b2mNLPE5WJVHFlxA7tRVfYTnsDdqVug", // Replace this with your actual token
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data.results.map((movie) => ({
    title: movie.original_title,
    overview: movie.overview,
    poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    release_date: movie.release_date,
  }));
};

// Save movies to the backend (let the backend handle uniqueness)
const saveMoviesToDB = async (movies) => {
  const url = "http://localhost:5000/save-movies";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movies),
  });
};

const SlideComp = () => {
  const { movies: dbMovies, loading, error } = useFetchFromDB(); // Custom hook to fetch data

  useEffect(() => {
    const fetchAndSaveMovies = async () => {
      try {
        // Fetch popular movies from TMDB
        const tmdbMovies = await fetchPopularMoviesFromTMDB();

        // Save movies to backend (backend handles duplicates)
        await saveMoviesToDB(tmdbMovies);

        console.log("Movies sent to the backend for processing.");
      } catch (err) {
        console.error("Error fetching and saving movies:", err);
      }
    };

    if (!loading) {
      fetchAndSaveMovies();
    }
  }, [loading]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error fetching movies: {error}</p>;

  return (
    <section className="popular-movies">
      <h2>What's Popular</h2>
      <Slider {...sliderSettings}>
        {dbMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </Slider>
    </section>
  );
};

export default SlideComp;
