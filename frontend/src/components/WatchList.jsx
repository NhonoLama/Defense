import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Watchlist.css";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state for better error handling
  const navigate = useNavigate(); // Initialize navigate hook

  // Fetch the watchlist on component mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in localStorage.");
        }

        const response = await fetch("http://localhost:5000/api/watchlist", {
          headers: {
            Authorization: `Bearer ${token}`, // Proper Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch watchlist.");
        }

        const data = await response.json();
        setMovies(data.watchlist || []);
      } catch (error) {
        setError(error.message); // Set error message for display
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false); // Ensure loading state is always updated
      }
    };

    fetchWatchlist();
  }, []);

  // Remove a movie from the watchlist
  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage.");
      }

      const response = await fetch(
        `http://localhost:5000/api/watchlist/${movieId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Proper Authorization header
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to remove movie from watchlist."
        );
      }

      // Update state by removing the deleted movie
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== movieId)
      );
      alert("Movie removed from watchlist!");
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      alert(error.message || "Failed to remove movie from watchlist.");
    }
  };

  // Conditional rendering based on states
  if (loading) return <p>Loading watchlist...</p>;
  if (error) return <p>Error fetching watchlist: {error}</p>;
  if (!movies.length) return <p className="empty">Your watchlist is empty!</p>;

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      <div className="watchlist-movies">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-item">
            <img src={movie.poster_path} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p>{movie.release_date}</p>
            <button
              className="remove-from-watchlist-btn"
              onClick={() => handleRemoveFromWatchlist(movie._id)}
            >
              Remove from Watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
