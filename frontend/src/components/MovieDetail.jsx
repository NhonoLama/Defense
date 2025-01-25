import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./MovieDetail.css";

const MovieDetail = () => {
  const { title } = useParams(); // Get the movie title from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const response = await fetch(`http://localhost:5000/movies/${title}`);
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [title]);

  const handleAddToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to manage your watchlist.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add movie to watchlist");
      }

      alert("Movie added to watchlist!");
    } catch (error) {
      alert("Failed to add movie to watchlist");
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to leave a comment.");
      return;
    }

    const userName = "User123"; // Replace with actual logged-in user's name if applicable
    const commentId = new Date().getTime(); // Example of generating a unique ID based on time
    const commentText = comment.trim(); // Get the comment text and trim any extra spaces

    // Check if comment is empty
    if (!commentText) {
      alert("Please enter a comment.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/movies/${title}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: commentId, // Use the generated comment ID
            name: userName, // User's name (could be dynamically fetched)
            review: commentText, // The comment text
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit comment");
      }

      setComment(""); // Clear the input field after successful submission
      alert("Comment added!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-detail-container">
      <div className="movie-header">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1 className="movie-title">
            {movie.title} <span>({movie.release_date.split("-")[0]})</span>
          </h1>
          <p className="movie-overview">{movie.overview}</p>
        </div>

        {/* Add to Watchlist Button */}
        <button
          onClick={() => handleAddToWatchlist(movie._id)}
          className="add-to-watch-btn"
        >
          Add to Watchlist
        </button>
      </div>

      {/* Comment Section (without displaying comments) */}
      <div className="comment-section">
        <h2>Leave a Comment</h2>
        <div className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
          ></textarea>
          <button onClick={handleCommentSubmit} className="submit-comment-btn">
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
