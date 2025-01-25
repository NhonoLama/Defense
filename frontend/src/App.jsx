import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import LoginForm from "./components/loginsignup/LoginForm";
import RegistrationForm from "./components/loginsignup/RegistrationForm";
import Watchlist from "./pages/WatchListPage"; // Make sure this is imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stayLoggedIn = localStorage.getItem("stayLoggedIn") === "true";
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    return stayLoggedIn && isLogged;
  });

  useEffect(() => {
    // Remove the token and related flags on the first load
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("stayLoggedIn");

    // Ensure user is not logged in on the initial load
    setIsLoggedIn(false);
  }, []); // Empty dependency array ensures this runs only once on first load

  useEffect(() => {
    // Sync isLoggedIn state with localStorage whenever it changes
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
    console.log("User logged in:", isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    // Set isLoggedIn and stayLoggedIn to true on login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("stayLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear authentication tokens and localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("stayLoggedIn");
    localStorage.removeItem("token");

    // Immediately update isLoggedIn state to false
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Default route will show the login page first */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" /> // Redirect to home if already logged in
              ) : (
                <LoginForm setIsLoggedIn={handleLogin} />
              )
            }
          />
          {/* Route for registration */}
          <Route path="/register" element={<RegistrationForm />} />
          {/* Protected route for home */}
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          {/* Protected route for movie details */}
          <Route
            path="/movies/:title"
            element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/watchlist"
            element={isLoggedIn ? <Watchlist /> : <Navigate to="/login" />}
          />{" "}
          {/* Add the watchlist route */}
          {/* Redirect all other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
