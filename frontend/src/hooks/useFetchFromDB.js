import { useState, useEffect } from "react";

const useFetchFromDB = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMoviesFromDB() {
      const url = "http://localhost:5000/movies"; // Your backend API endpoint

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data); // Set movies from the database
      } catch (error) {
        console.error("Error fetching movies from database:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMoviesFromDB();
  }, []); // Empty dependency array to fetch only once

  return { movies, loading, error }; // Return movies, loading state, and error if any
};

export default useFetchFromDB;
