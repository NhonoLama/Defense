import React, { useState } from "react";
import "./MovieCard.css"; // Style your MovieCard
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for showing loading

  // Function to handle movie card click
  const handleMovieClick = async () => {
    try {
      setLoading(true); // Start loading

      // Check if the movie exists in the database
      const response = await fetch(
        `http://localhost:5000/movies/check/${encodeURIComponent(movie.title)}`
      );
      const data = await response.json();

      // If the movie doesn't exist, add it to the database
      if (!data.exists) {
        const addResponse = await fetch("http://localhost:5000/movies/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            overview: movie.overview,
          }),
        });

        const addResult = await addResponse.json();
        if (addResponse.ok) {
          console.log("Movie added to database:", addResult.movie);
        } else {
          console.error("Error adding movie:", addResult.error);
        }
      } else {
        console.log("Movie already exists in the database.");
      }

      // Scrape and update comments for the movie
      const scrapeResponse = await fetch(
        "http://localhost:5000/movies/scrape-comments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: movie.title }),
        }
      );

      const scrapeResult = await scrapeResponse.json();
      if (scrapeResponse.ok) {
        console.log(scrapeResult.message);
      } else {
        console.error("Error scraping comments:", scrapeResult.error);
      }

      // Navigate to the movie detail page
      navigate(`/movies/${encodeURIComponent(movie.title)}`);
    } catch (error) {
      console.error("Error checking or adding movie:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div onClick={handleMovieClick}>
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Show spinner while loading
      ) : (
        <div className="movie-card">
          <img
            src={movie.poster_path}
            onError={(e) => {
              e.target.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            }}
            alt={movie.title || "Movie Poster"}
            className="movie-poster"
          />

          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
